import { Button, Text, View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
// import { Host, Button } from "@expo/ui/jetpack-compose";
import { Link, useRouter } from "expo-router";
export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.helloWorldTitle}>Hello World.</Text>
      <TextInput placeholder="Email" />
        <ActivityIndicator size={"large"}/>
        <Link href={"/about"}>Go to about screen</Link>
        
        <Button title="Navigate" onPress={() => router.push("/about")} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  helloWorldTitle: {
    color: "red"
  },
  image:{
    width: 200,
    height: 200
  }
})

