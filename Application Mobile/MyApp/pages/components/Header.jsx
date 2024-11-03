import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Header = ({ navigation }) => {
  const { user, authenticate } = useContext(AuthContext)
  return (
    <View style={styles.header}>
      <Text style={styles.text}>WikiMovie</Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "end",
        gap: 10
      }}>
        {
          !user ?
            <Icon.Button
              name="user"
              backgroundColor="rgba(0,0,0,0)"
              onPress={() => navigation.navigate('Connexion', null)}
            ></Icon.Button> :
            <Pressable style={styles.userInfo} onPress={() => authenticate(false)}>
              <Ionicons name={'log-out-outline'} size={25} color={"#fff"} />
            </Pressable>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1d1d1d",
    height: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: "5%",
    paddingBottom: "5%",
  },
  text: {
    color: "#f6f6f6",
    fontSize: 25,
    width: "50%",
  },
  username: {
    color: "#f6f6f6",
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginRight: 20
  }
})