import CustomButton from "@/components/custom-button";
import SeatMapPreview from "@/components/seat-mapping";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.68;
const DATES = [
    { id: "1", day: "5", month: "Mar" },
    { id: "2", day: "6", month: "Mar" },
    { id: "3", day: "7", month: "Mar" },
    { id: "4", day: "8", month: "Mar" },
    { id: "5", day: "9", month: "Mar" },
];

const SHOWTIMES = [
    { id: "1", time: "12:30", hall: "Cinetech + Hall 1", price: 50, bonus: 2500 },
    { id: "2", time: "13:30", hall: "Cinetech + Hall 2", price: 75, bonus: 3000 },
    { id: "3", time: "15:00", hall: "Cinetech + Hall 1", price: 60, bonus: 2800 },
];

const SeatMapping = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(DATES[0].id);
    const [selectedShowtime, setSelectedShowtime] = useState(SHOWTIMES[0].id);
    const { title, releaseDate } = useLocalSearchParams<{ title: string; releaseDate: string }>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={26} color="#1c1c1e" />
                </TouchableOpacity>
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Text style={styles.headerSubtitle}>In Theaters {releaseDate}</Text>
                </View>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionLabel}>Date</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateRow}
                >
                    {DATES.map((date) => {
                        const isSelected = date.id === selectedDate;
                        return (
                            <TouchableOpacity
                                key={date.id}
                                style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                                onPress={() => setSelectedDate(date.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dateChipText, isSelected && styles.dateChipTextSelected]}>
                                    {date.day} {date.month}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + 16}
                    decelerationRate="fast"
                    contentContainerStyle={styles.showtimeRow}
                >
                    {SHOWTIMES.map((showtime) => {
                        const isSelected = showtime.id === selectedShowtime;
                        return (
                            <TouchableOpacity
                                key={showtime.id}
                                activeOpacity={0.9}
                                onPress={() => setSelectedShowtime(showtime.id)}
                                style={styles.showtimeCardWrapper}
                            >
                                <View style={styles.showtimeHeader}>
                                    <Text style={styles.showtimeTime}>{showtime.time}</Text>
                                    <Text style={styles.showtimeHall}>{showtime.hall}</Text>
                                </View>

                                <View
                                    style={[
                                        styles.showtimeCard,
                                        isSelected && styles.showtimeCardSelected,
                                    ]}
                                >
                                    <SeatMapPreview />
                                </View>

                                <Text style={styles.priceText}>
                                    From <Text style={styles.priceBold}>{showtime.price}$</Text> or{" "}
                                    <Text style={styles.priceBold}>{showtime.bonus} bonus</Text>
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton text="Select Seats" onPress={() => {
                    router.navigate({ pathname: '/checkout-screen', params: { title: title, releaseDate: releaseDate } });
                }} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: "#fff",
    },
    backButton: {
        paddingTop: 4,
    },
    headerTextBlock: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        paddingTop: 14,
        fontSize: 16,
        fontWeight: "500",
        color: "#202C43",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#61C3F2",
        marginTop: 2,
        fontWeight: "500",
    },
    body: {
        flex: 1,
        backgroundColor: "#F2F4F7",
    },
    bodyContent: {
        paddingTop: 24,
        paddingBottom: 24,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: 'Poppins',
        color: "#202C43",
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    dateRow: {
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 28,
    },
    dateChip: {
        width: 67,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: "#A6A6A61A",
    },
    dateChipSelected: {
        backgroundColor: "#61C3F2",
    },
    dateChipText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#202C43",
        lineHeight: 20
    },
    dateChipTextSelected: {
        color: "#FFFFFF",
    },
    showtimeRow: {
        paddingHorizontal: 20,
        gap: 16,
    },
    showtimeCardWrapper: {
        width: CARD_WIDTH,
    },
    showtimeHeader: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 10,
    },
    showtimeTime: {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: 'Poppins-Medium',
        color: "#202C43",
    },
    showtimeHall: {
        fontSize: 12,
        color: "#8F8F8F",
        fontFamily: 'Poppins-Regular',
        fontWeight: "400",
    },
    showtimeCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: "gray",
        paddingVertical: 20,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    showtimeCardSelected: {
        borderColor: "#61C3F2",
        borderWidth: 1
    },
    priceText: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 12,
    },
    priceBold: {
        fontWeight: "700",
        color: "#202C43",
        fontSize: 12,
    },
    seatMapContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    seatGrid: {
        marginTop: -10,
        alignItems: "center",
    },
    seatRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2.5,
        gap: 10,
    },
    sectionBlock: {
        flexDirection: "row",
        gap: 2,
    },
    seatDot: {
        width: 3.8,
        height: 2.5,
        borderRadius: 1,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
    },
});

export default SeatMapping;