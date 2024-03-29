import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

export const navBarIcons = [
  {
    nom: "Accueil",
    active: require("../../assets/images/Accueil-active.png"),
    inactive: require("../../assets/images/Accueil-inactive.png"),
  },
  {
    nom: "AjoutPost",
    active: require("../../assets/images/AjoutPost-active.png"),
    inactive: require("../../assets/images/AjoutPost-inactive.png"),
  },
  {
    nom: "Profil",
    active: require("../../assets/images/Profil-active.png"),
    inactive: require("../../assets/images/Profil-inactive.png"),
  },
];

export default function NavBar({ icons }) {
  const navigation = useNavigation();
  const route = useRoute(); // Ajoutez cette ligne

  const Icon = ({ icon }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(icon.nom);
      }}
    >
      <Image
        source={route.name === icon.nom ? icon.active : icon.inactive} // Modifiez cette ligne
        style={icon.nom === "AjoutPost" ? styles.iconAjouter : styles.icon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.conteneur}>
      {icons.map((icon, index) => (
        <Icon key={index} icon={icon} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  iconAjouter: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
});
