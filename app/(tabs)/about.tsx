import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image"
export default function About() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: "https://media1.tenor.com/m/uLLMKFFMQx0AAAAd/all-roads-lead-to-rome-white-rabbit.gif",
        }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image:{
    width: 200,
    height: 200
  }
})
