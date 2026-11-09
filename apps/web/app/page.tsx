const features = [
  { icon: '⌕', title: 'Discover better opportunities', text: 'Search meaningful roles with clear details, useful filters, and a simpler path to apply.' },
  { icon: '◈', title: 'Build a stronger team', text: 'Create an employer workspace, publish roles, and keep every candidate conversation organized.' },
  { icon: '↗', title: 'Move forward with insight', text: 'A focused recruitment workspace designed to make hiring progress visible.' },
];

export default function HomePage() {
  return <>
    <header className="container nav"><a className="brand" href="/">akazi<span>hub</span></a><nav className="navlinks"><a href="#how">How it works</a><a href="#employers">For employers</a><a href="#talent">For talent</a></nav><div className="navactions"><a className="btn btn-outline" href="/login">Log in</a><a className="btn btn-primary" href="/register">Get started</a></div></header>
    <main><section className="hero"><div className="container"><span className="eyebrow">Talent meets opportunity</span><h1>Good work changes lives. <em>Find your next move.</em></h1><p>Akazi Hub brings ambitious talent and forward-thinking employers together in one clear, trusted place to discover opportunities and build great teams.</p><div className="hero-actions"><a className="btn btn-primary" href="/register">Create your free account ↗</a><a className="btn btn-outline" href="#how">Explore the platform</a></div><div className="trust"><span>✓ Built for African talent</span><span>✓ Employer workspaces</span><span>✓ One place to move forward</span></div></div></section>
    <section className="section container" id="how"><div className="section-head"><span className="eyebrow">One connected platform</span><h2>Your next opportunity starts with a better connection.</h2><p>From discovering roles to managing hiring, Akazi Hub is being built around the people and teams doing the work.</p></div><div className="grid">{features.map((feature) => <article className="feature" key={feature.title}><div className="feature-icon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>
    <section className="section container" id="employers"><div className="cta"><div><span className="eyebrow">For growing teams</span><h2>Make your next great hire count.</h2><p>Set up your employer workspace and prepare your first role.</p></div><a className="btn btn-lime" href="/register">Create an employer account ↗</a></div></section></main>
    <footer className="container footer">© {new Date().getFullYear()} Akazi Hub. Built to connect talent with opportunity.</footer>
  </>;
}
