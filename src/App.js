import React from 'react';
import 'antd/dist/antd.css';
import useWallet from './hooks/useWallet';

import {Layout, Typography} from 'antd';
import KeyUpload from './components/KeyUpload';
import Dashboard from './components/Dashboard';

const {Header, Content, Footer} = Layout;
const {Title} = Typography;

const App = () => {
    const [{wallet, walletAddress}, setWallet] = useWallet();

    //wallet = localStorage.getItem('wallet');
    //setWallet(localStorage.getItem('wallet'));

    return (
        <Layout className="layout">
            <Header>
                <Title style={{color: '#fff', padding: '15px'}} level={3}>
                    Arweave Files
                </Title>
            </Header>
            <Content style={{padding: '25px 50px'}}>
                <div style={{background: '#fff', padding: 24, minHeight: 280}}>
                    {wallet ? (
                        <Dashboard walletAddress={walletAddress} wallet={wallet}/>
                    ) : (
                        <KeyUpload setWallet={setWallet}/>
                    )}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Arweave Project © 2019
            </Footer>
        </Layout>
    );
};

export default App;
