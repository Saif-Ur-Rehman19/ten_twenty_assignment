import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CustomButtonProps = {
    text: string;
    onPress: () => void;
}

const CustomButton = ({ text, onPress }: CustomButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#61C3F2",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: 'center',
        flexGrow: 1
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
})

export default CustomButton;