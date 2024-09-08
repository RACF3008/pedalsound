import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';

import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps} />
        </div>
    );
};

// En el caso de estar trabajando getInitialProps en el index.js
// no había problema con obtener req de context y pasarlo al 
// constructor de cliente de axios. Sin embargo, aquí tenemos
// un caso diferente ya que req se encuentra más anidado dentro
// de context. Lo llamaremos appContext.
AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default AppComponent;