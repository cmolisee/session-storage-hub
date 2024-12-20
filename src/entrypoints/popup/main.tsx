import { render } from 'solid-js/web';
import './style.css';
import { ExtensionProvider } from '@/hooks/useExtensionOptions';
import { HashRouter, Route } from '@solidjs/router';
import Popup from './popup';
import Options from './options';

render(() => {
    return (
        <ExtensionProvider>
            <StorageProvider>
                <HashRouter>
                    <Route path={'/'} component={Popup} />
                    <Route path={'/options'} component={Options} />
                </HashRouter>
            </StorageProvider>
        </ExtensionProvider>
    )
}, document.getElementById('root')!);
