import { Home } from "./pages/Home"
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { useContext, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Library } from './pages/components/Library/Library';
import { MovieList } from './pages/components/Movie/MovieList';
import { NavigationContainer } from '@react-navigation/native';
import { SerieList } from './pages/components/Series/SerieList';
import AuthContext, { AuthProvider } from "./contexts/AuthContext"
import { MovieDetails } from './pages/components/Movie/MovieDetails';
import { SeriesDetails } from './pages/components/Series/SeriesDetails';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MovieStack = new createNativeStackNavigator();
const SerieStack = new createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {

  const { user } = useContext(AuthContext)

  useEffect(() => {

  }, [])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Connexion':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Films':
              iconName = focused ? 'film' : 'film-outline';
              break;
            case 'Series':
              iconName = focused ? 'tv' : 'tv-outline';
              break;
            case 'Collection':
              iconName = focused ? 'library' : 'library-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#252525',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Films"
        component={MovieStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Series"
        component={SerieStackScreen}
        options={{ headerShown: false }}
      />
      {!user ?
        <Tab.Screen name="Connexion" component={Login} options={{ headerShown: false }} />
        :
        <Tab.Screen name="Collection" component={Library} options={{ headerShown: false }} />
      }
    </Tab.Navigator>
  )
}

export const MovieStackScreen = () => {
  return (
    <MovieStack.Navigator>
      <MovieStack.Screen
        name="All"
        component={MovieList}
        options={{ headerShown: false }}
      />
      <MovieStack.Screen
        name="movieDetails"
        component={MovieDetails}
        options={{
          title: "Détails",
          headerShown: false
        }}
      />
    </MovieStack.Navigator>
  )
}

export const SerieStackScreen = () => {
  return (
    <SerieStack.Navigator>
      <SerieStack.Screen
        name="All"
        component={SerieList}
        options={{ headerShown: false }}
      />
      <SerieStack.Screen
        name="serieDetails"
        component={SeriesDetails}
        options={{
          title: "Détails",
          headerShown: false
        }}
      />
    </SerieStack.Navigator>
  )
}

export default function App() {

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </AuthProvider>
  );
}
