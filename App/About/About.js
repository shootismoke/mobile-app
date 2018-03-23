import React, { Component } from 'react';
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class About extends Component {
  handleOpenGithub = () => Linking.openURL('http://github.com');

  render() {
    const { ...rest } = this.props;

    return (
      <Modal animationType="slide" transparent={true} {...rest}>
        <View style={styles.container}>
          <ScrollView style={styles.text}>
            <Text style={styles.title}>How is the equivalence calculated?</Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              pellentesque odio eu elit rhoncus, et malesuada quam gravida.
              Pellentesque vehicula eros ac velit vestibulum, id facilisis
              tellus aliquam. Donec sit amet viverra lectus. Nam quis velit
              gravida ante ornare consequat nec id dolor. Phasellus et lectus ac
              dolor semper dictum ac nec lectus. Nullam est lectus, lobortis at
              mattis placerat, interdum ac dui. Etiam at finibus mi. Fusce
              consectetur molestie leo sit amet consectetur. Phasellus ut massa
              orci. Ut quis commodo nunc. Duis egestas tempor eros. Donec
              tristique condimentum dolor id sodales. Curabitur fermentum rutrum
              imperdiet. Cras vitae est eget ex ultrices suscipit. Donec
              bibendum nec justo eu convallis. Nunc pellentesque aliquet
              interdum. Nullam non nisl gravida, placerat diam a, finibus
              tellus. Vivamus et faucibus arcu. Etiam dui felis, ultricies
              mattis tristique quis, varius sed libero. Pellentesque iaculis est
              sed lectus tristique dapibus. Etiam neque risus, scelerisque sed
              maximus a, blandit nec urna. Suspendisse vitae neque ut risus
              blandit interdum in quis sem. Duis fermentum mauris ac ante
              imperdiet suscipit. Curabitur eu nunc commodo lectus imperdiet
              rhoncus. Donec viverra, tellus in aliquet porttitor, erat ipsum
              molestie massa, vitae pretium arcu metus id arcu. Fusce
              condimentum ipsum ac fringilla lobortis. Quisque a velit tempus,
              tincidunt nibh in, vestibulum neque. Nunc suscipit luctus metus id
              semper. Duis fermentum est bibendum dictum tincidunt. Integer
              vestibulum porta ante vel tincidunt. Integer luctus eget risus eu
              egestas. In dictum gravida est non gravida. In cursus id magna
              tempus cursus. Aenean et ultricies ipsum, aliquet gravida velit.
              Pellentesque ornare vitae ante a pulvinar. Praesent dui diam,
              condimentum sed eros vitae, bibendum semper leo. Vivamus
              ullamcorper ornare rutrum. Integer hendrerit metus ligula, non
              vehicula lorem euismod vitae. Nulla gravida maximus eleifend.
              Phasellus vel lobortis ligula. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis egestas.
              Vestibulum blandit ultricies eros, a feugiat risus sodales et.
              Etiam semper luctus magna dapibus ullamcorper. Praesent congue
              urna in arcu tristique, a laoreet risus mollis. Cras ut velit ac
              orci volutpat interdum. Curabitur congue consectetur ultricies.
              Maecenas ipsum ex, porta sed nisi vel, sodales vestibulum urna.
              Duis eget dapibus leo. Aenean lobortis commodo magna id interdum.
              Mauris ut commodo nunc. Praesent tristique diam in placerat
              ultrices. Mauris vitae sapien ac nunc maximus vehicula.
            </Text>
            <Text style={styles.title}>Credits</Text>
            <Text>Design by Marcelo S. Coelho.</Text>
            <Text>Development by Amaury Martiny.</Text>
            <Text>
              Get in touch with us on{' '}
              <Text onPress={this.handleOpenGithub}>Github</Text> or at
              mail@gmail.com.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  cigarettesCount: {
    fontSize: 72
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  text: {
    backgroundColor: 'white',
    paddingHorizontal: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
