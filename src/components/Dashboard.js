import React, {useState, useEffect} from 'react';
import {getAllPortfolioTransactions} from '../api';
import {Button, Spin, Table} from 'antd';
import {uploadFile} from '../api';

import AddTransaction from './AddTransaction';

const Dashboard = ({walletAddress, wallet}) => {
    const [portfolioTransactions, setPortfolioTransactions] = useState([]);
    const [addTransactionVisible, setAddTransactionVisible] = useState(false);
    const statusNothing = 'nothing';
    const statusUploading = 'uploading';
    const statusUploaded = 'uploaded';

    let uploadFileRef = React.createRef();
    let [photoUploadingStatus, setStatus] = useState(statusNothing);

    const onUpload = info => {
        let file = null;
        const input = uploadFileRef.current;
        input.value = null;
        input.onchange = () => {
            console.log(uploadFileRef.current.files);

            const filereader = new FileReader();
            filereader.addEventListener('loadend', async event => {
                try {
                    setStatus(statusUploading);
                    //console.log(file);
                    const result = await uploadFile(event.target.result, file.name, file.size, wallet);
                    setStatus(statusUploaded);
                    console.log(result);
                } catch (e) {
                    console.log(e);
                }
            });

            file = uploadFileRef.current.files[0];
            filereader.readAsDataURL(uploadFileRef.current.files[0]);
        };

        //input.accept = "image/*";
        input.click();
    };

    useEffect(() => {
        getAllPortfolioTransactions(walletAddress).then(setPortfolioTransactions);
    }, [walletAddress]);

    const getFileName = file => {
        let tags = {};
        file.get('tags').forEach(tag => {
            let key = tag.get('name', {decode: true, string: true});
            tags[key] = tag.get('value', {decode: true, string: true});
        });

        return tags["name"];
    };

    const onDownload = (file) => {
        const filename = getFileName(file);
        let data = file.get('data', {decode: true, string: true});
        let a = document.createElement("a");
        a.href = data;
        a.download = filename;
        a.click();
    };

    return (
        <div>
            <Button
                onClick={() => onUpload()}
                type="file"
                size="large"
            >
                Upload file (less than 3 Mb)
            </Button>
            <br/><br/>
            <input type="file" ref={uploadFileRef} style={{display: 'none'}}/>

            {photoUploadingStatus === statusUploading ? <div>
                <p>Uploading file...</p>
                <Spin size="large"/>
            </div> : <span/>}
            {photoUploadingStatus === statusUploaded ?
                <div>
                    <p>File uploaded! Sending your file to the perma-storage... check back soon.</p>
                    <p>File will not be displayed until it has been mined into a block.</p>
                </div> : <span/>}

            {portfolioTransactions.length ?
                <Table
                    dataSource={portfolioTransactions}
                    columns={[
                        {
                            title: 'Name', key: 'name', render: file => getFileName(file)
                        },
                        {
                            title: 'Action', key: 'data', render: file => {
                                console.log(file);
                                return <Button
                                    onClick={_ => onDownload(file)}
                                    type="file"
                                    size="large"
                                >
                                    Download
                                </Button>;
                            }
                        },

                    ]}
                    //rowKey={JSON.stringify}
                />


                :
                <div>
                    <p>Your files will appear here.</p>
                    <p>
                        If you have added a file recently, please wait some time for
                        it to reflect on the blockchain.
                    </p>
                </div>
            }

            <AddTransaction
                visible={addTransactionVisible}
                closeModal={() => {
                    setAddTransactionVisible(false);
                }}
                wallet={wallet}
            />
        </div>
    );
};

export default Dashboard;
