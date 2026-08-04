import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    placeholder?: string;
};

const SearchBar = ({ value, onChangeText, onClear, placeholder = "Search movies" }: SearchBarProps) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#8e8e93"
                returnKeyType="search"
                autoCorrect={false}
                clearButtonMode="never"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={20} color="#1c1c1e" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eef0f2",
        borderRadius: 24,
        paddingHorizontal: 14,
        height: 48,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#1c1c1e",
        padding: 0,
    },
});

export default SearchBar;