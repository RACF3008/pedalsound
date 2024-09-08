import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign In', href: '/auth/signin'},
        !currentUser && { label: 'Sign Up', href: '/auth/signup'},
        currentUser && { label: 'Sign Out', href: '/auth/signout'}
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <li key={href} className='nav-item nav-link'>
                <Link href={href}>
                {label}
                </Link>
            </li>
        });
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/" className='navbar-brand'>
                Pedalsound
            </Link>

            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
    )
};