import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, Platform, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { creerPost } from "../../services/firebase/fonctionPost";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../services/firebase/init";

export default function AjoutPost() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const navigation = useNavigation(); // Ajoutez cette ligne

  const soumettre = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Aucun utilisateur n'est actuellement connecté");
      }

      const userId = user.uid;
      const postId = await creerPost(userId, image, description);
      console.log("Post créé avec l'ID :", postId);
      alert("Nouvelle publication ajouter!");
      navigation.navigate("Profil");
    } catch (error) {
      console.error("Erreur lors de la création du post :", error);
      alert("Une erreur est survenue lors de la création du post!");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Désolé, nous avons besoin des permissions pour accéder à votre galerie !");
      }
    })();
  }, []);

  const choisirImage = async () => {
    let resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(resultat);

    if (!resultat.cancelled) {
      setImage(resultat.assets[0].uri);
    }
  };

  return (
    <View style={styles.conteneur}>
      <TouchableOpacity onPress={choisirImage}>
        <Image
          source={image ? { uri: image } : require("../../assets/images/ajouter-image.png")}
          style={{ width: "100%", height: 325 }}
        />
      </TouchableOpacity>

      <View style={styles.conteneurForm}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Ajoutez une description..."
          style={styles.descriptionInput}
          multiline
          numberOfLines={4}
          maxLength={100}
        />
        <Text style={styles.counterText}>{description.length}/100</Text>
        <TouchableOpacity onPress={soumettre} style={styles.btnSoumettre}>
          <Text style={styles.btnText}>Soumettre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    // justifyContent: "space-between",
  },
  conteneurForm: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 20,
    // justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    // justifyContent: "space-around",
  },
  descriptionInput: {
    // height: 40,
    backgroundColor: "#F1F1F1",
    borderColor: "#E7E7E7",
    borderRadius: 5,
    borderWidth: 1,
    width: "85%",
    paddingHorizontal: 5,
  },
  btnSoumettre: {
    backgroundColor: "#F27059",
    width: 130,
    padding: 8,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#EA5940",
  },
  btnText: {
    color: "#fff",
    alignItems: "center",
    fontFamily: "Inter-Bold",
    // fontSize: 16,
  },
});
