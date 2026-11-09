import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, WorkspaceRole, WorkspaceType } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const REFRESH_COOKIE = 'akazi_refresh';
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private digest(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private slugify(value: string) {
    const base = value.toLowerCase().normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
    return `${base || 'workspace'}-${randomBytes(3).toString('hex')}`;
  }

  private async issueSession(userId: string) {
    const sessionId = randomUUID();
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, sid: sessionId, jti: randomUUID() },
      { secret: this.refreshSecret(), expiresIn: '30d' },
    );
    await this.prisma.refreshSession.create({
      data: { id: sessionId, userId, tokenHash: this.digest(refreshToken), expiresAt: new Date(Date.now() + REFRESH_TTL_MS) },
    });
    const accessToken = await this.jwt.signAsync(
      { sub: userId },
      { secret: this.accessSecret(), expiresIn: '15m' },
    );
    return { accessToken, refreshToken };
  }

  private accessSecret() {
    const value = process.env.JWT_ACCESS_SECRET;
    if (!value || value.length < 32) throw new Error('JWT_ACCESS_SECRET must contain at least 32 characters');
    return value;
  }

  private refreshSecret() {
    const value = process.env.JWT_REFRESH_SECRET;
    if (!value || value.length < 32) throw new Error('JWT_REFRESH_SECRET must contain at least 32 characters');
    return value;
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (exists) throw new ConflictException('An account with this email already exists');
    const passwordHash = await hash(dto.password, 12);
    let created: {
      user: { id: string; email: string; firstName: string; lastName: string };
      workspace: { id: string; name: string; slug: string; type: WorkspaceType };
    };
    try {
      created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, passwordHash, firstName: dto.firstName.trim(), lastName: dto.lastName.trim() },
        select: { id: true, email: true, firstName: true, lastName: true },
      });
      const workspace = await tx.workspace.create({
        data: {
          name: dto.workspaceName.trim(),
          slug: this.slugify(dto.workspaceName),
          type: WorkspaceType.EMPLOYER,
          members: { create: { userId: user.id, role: WorkspaceRole.OWNER } },
        },
        select: { id: true, name: true, slug: true, type: true },
      });
      await tx.auditLog.create({ data: { actorId: user.id, action: 'auth.register', resource: 'user', resourceId: user.id } });
        return { user, workspace };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An account with this email already exists');
      }
      throw error;
    }
    const tokens = await this.issueSession(created.user.id);
    return { ...created, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.trim().toLowerCase() } });
    if (!user || !user.isActive || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokens = await this.issueSession(user.id);
    await this.prisma.auditLog.create({ data: { actorId: user.id, action: 'auth.login', resource: 'user', resourceId: user.id } });
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      ...tokens,
    };
  }

  async refresh(token: string) {
    let payload: { sub: string; sid: string };
    try {
      payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret() });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh session');
    }
    const session = await this.prisma.refreshSession.findUnique({ where: { id: payload.sid } });
    if (!session || session.userId !== payload.sub || session.revokedAt || session.expiresAt <= new Date() || session.tokenHash !== this.digest(token)) {
      throw new UnauthorizedException('Refresh session is no longer valid');
    }
    const rotation = await this.prisma.refreshSession.updateMany({
      where: { id: session.id, tokenHash: this.digest(token), revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date(), lastUsedAt: new Date() },
    });
    if (rotation.count !== 1) throw new UnauthorizedException('Refresh session has already been rotated');
    const tokens = await this.issueSession(payload.sub);
    return tokens;
  }

  async logout(token?: string) {
    if (!token) return;
    try {
      const payload = await this.jwt.verifyAsync<{ sid: string }>(token, { secret: this.refreshSecret() });
      await this.prisma.refreshSession.updateMany({ where: { id: payload.sid, revokedAt: null }, data: { revokedAt: new Date() } });
    } catch {
      // Logout is intentionally idempotent; invalid cookies are simply cleared by the controller.
    }
  }

  cookieOptions() {
    return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/api/v1/auth', maxAge: REFRESH_TTL_MS };
  }

  refreshCookieName() { return REFRESH_COOKIE; }
}
