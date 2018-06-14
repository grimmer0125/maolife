import React, { Component } from 'react';

import {
  Container, Button, Card, CardItem,
  Body, Item, Input, Right, Text,
} from 'native-base';

import I18n from './i18n/i18n';

class ShareDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authID: '',
    };
  }

  handleChangeAuthID = (text) => {
    this.setState({ authID: text });
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#F5FCFF' }}>
        <Card>
          <CardItem>
            <Body>
              <Text>
                {I18n.t("Input your friend's KID to authorize him/her to manage this pet")}
              </Text>
            </Body>
          </CardItem>
          <CardItem cardBody>
            <Item regular>
              <Input
                autoCapitalize="none"
                onChangeText={this.handleChangeAuthID}
                onSubmitEditing={() => this.props.onSave(this.state.authID)}
              />
            </Item>
          </CardItem>

          <CardItem>
            <Button onPress={this.props.onCancel}>
              <Text>{I18n.t('Cancel')}</Text>
            </Button>
            <Right>
              <Button onPress={() => this.props.onSave(this.state.authID)}>
                <Text>{I18n.t('Save')}</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </Container>
    );
  }
}

export default ShareDialog;
