import { Dimensions, StyleSheet, View } from "react-native";
import CurvedArcHeader from "./curved-arc-header";

const SEAT_LAYOUT = [
    // Row 0
    { left: [0, 0], center: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], right: [0, 0] },
    // Row 1
    { left: [1, 1, 1], center: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 2
    { left: [1, 1, 1], center: [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1], right: [1, 1, 1] },
    // Row 3
    { left: [1, 1, 1], center: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 4
    { left: [1, 1, 1], center: [1, 2, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 5
    { left: [1, 1, 1], center: [1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 6
    { left: [1, 1, 1], center: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 7
    { left: [1, 1, 1], center: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 8
    { left: [1, 1, 1], center: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], right: [1, 1, 1] },
    // Row 9
    { left: [1, 1, 1], center: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], right: [1, 1, 1] },
    // Row 10
    { left: [0, 1, 1], center: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], right: [1, 1, 0] },
];

const SEAT_COLOR_MAP: Record<number, string> = {
    0: "transparent",
    1: "#B7C8DB", 
    2: "#56C2F3", 
    3: "#E96497",
    4: "#4A3285",
};
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.68

const SeatMapPreview = () => {
    return (
        <View style={styles.seatMapContainer} pointerEvents="none">
            <CurvedArcHeader />
            <View style={styles.seatGrid}>
                {SEAT_LAYOUT.map((row, rowIndex) => {
                    const translateY = Math.pow(Math.abs(rowIndex - 5), 1.1) * 0.25;
                    return (
                        <View key={rowIndex} style={[styles.seatRow, { transform: [{ translateY }] }]}>
                            <View style={styles.sectionBlock}>
                                {row.left.map((type, colIndex) => (
                                    <View
                                        key={`l-${colIndex}`}
                                        style={[
                                            styles.seatDot,
                                            { backgroundColor: SEAT_COLOR_MAP[type] },
                                        ]}
                                    />
                                ))}
                            </View>

                            <View style={styles.sectionBlock}>
                                {row.center.map((type, colIndex) => (
                                    <View
                                        key={`c-${colIndex}`}
                                        style={[
                                            styles.seatDot,
                                            { backgroundColor: SEAT_COLOR_MAP[type] },
                                        ]}
                                    />
                                ))}
                            </View>
                            <View style={styles.sectionBlock}>
                                {row.right.map((type, colIndex) => (
                                    <View
                                        key={`r-${colIndex}`}
                                        style={[
                                            styles.seatDot,
                                            { backgroundColor: SEAT_COLOR_MAP[type] },
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
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

export default SeatMapPreview;