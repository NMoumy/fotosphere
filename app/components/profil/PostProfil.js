import React, { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet, TouchableOpacity, Animated, Dimensions, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { obtenirPostsParUserId, obtenirPostsUtilisateurConnecte } from "../../services/firebase/fonctionPost";

export default function PostProfil({userAutre, estEcranProfilAutre}) {
  const [categorieSelectionnee, setCategorieSelectionnee] = useState(0);
  const positionBarre = useState(new Animated.Value(0))[0];
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    let unsubscribe;

    if (estEcranProfilAutre) {
      unsubscribe = obtenirPostsParUserId(userAutre, setPosts);
    } else {
      unsubscribe = obtenirPostsUtilisateurConnecte(setPosts);
    }

    // Se désinscrire de l'écouteur lorsque le composant est démonté
    return () => unsubscribe();
  }, [userAutre, estEcranProfilAutre]);

  const gererClick = (post) => {
    navigation.navigate("PostDetail", { post });
  };

  console.log("userAutre", userAutre);

  const selectionnerCategorie = (index) => {
    setCategorieSelectionnee(index);
    Animated.timing(positionBarre, {
      toValue: (Dimensions.get("window").width / 2) * index,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const categories = [
    {
      nom: "galerie",
      active: require("../../assets/images/galerie-active.png"),
      inactive: require("../../assets/images/galerie-inactive.png"),
    },
    {
      nom: "coeur",
      active: require("../../assets/images/coeur-active.png"),
      inactive: require("../../assets/images/coeur-inactive.png"),
    },
  ];

  return (
    <View style={styles.conteneur}>
      <View style={styles.conteneurCategorie}>
        {categories.map((categorie, index) => (
          <View key={index} style={styles.categorie} onTouchEnd={() => selectionnerCategorie(index)}>
            <Image
              source={categorieSelectionnee === index ? categorie.active : categorie.inactive}
              style={styles.icon}
            />
          </View>
        ))}
        <View style={styles.barreNonSelectionee} />
        <Animated.View
          style={[
            styles.barre,
            { width: Dimensions.get("window").width / 2, transform: [{ translateX: positionBarre }] },
          ]}
        />
      </View>

      <View style={styles.conteneurImages}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.imageConteneur}>
              <TouchableOpacity onPress={() => gererClick(item)}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "white",
  },

  conteneurCategorie: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingTop: 10,
  },

  categorie: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  // texte: {
  //   textAlign: "center",
  //   fontSize: 14,
  //   color: "#7C8089",
  // },

  // texteSelectionne: {
  //   color: "#EA5D55",
  // },

  barre: {
    position: "absolute",
    bottom: 0,
    height: 2,
    backgroundColor: "#EA5D55",
  },

  barreNonSelectionee: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: "100%",
    backgroundColor: "#D9D9D9",
  },

  conteneurImages: {
    flex: 1,
    minHeight: 345,
    backgroundColor: "#fafafa",
    paddingVertical: 10,
  },

  imageConteneur: {
    flex: 1,
    aspectRatio: 1,
    flexDirection: "column",
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    borderRadius: 4,
    width: "100%",
    aspectRatio: 1,
  },
});
