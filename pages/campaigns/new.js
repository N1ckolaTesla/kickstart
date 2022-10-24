import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import { Router } from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});

        try {
            const account = await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            console.log(account);
            console.log(accounts);

            await factory.methods
            .createCampaign(this.state.minimumContribution)
            .send({from: account[0]})

            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage: err.message})
        }
        this.setState({loading: false});
    };

    render() {
        return(
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimun contribution</label>
                        <Input
                            label='Wei'
                            labelPosition='right'
                            placeholder='Amount of wei'
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew;