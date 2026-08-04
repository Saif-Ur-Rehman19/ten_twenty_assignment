import CurvedArcHeader from "@/components/curved-arc-header";
import CustomButton from "@/components/custom-button";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SeatStatus = "unavailable" | "regular" | "vip" | "selected";

type Seat = {
    id: string;
    row: number;
    seatNumber: number;
    status: SeatStatus;
};

const TOTAL_ROWS = 10;
const SECTION_SIZES = { left: 2, middle: 14, right: 4 };
const PRICES = { regular: 50, vip: 150 };
const isUnavailable = (row: number, col: number) => (row * 3 + col * 7) % 5 === 0;
const buildInitialSeats = (): Seat[][] => {
    const rows: Seat[][] = [];
    for (let row = 1; row <= TOTAL_ROWS; row++) {
        const isVipRow = row === TOTAL_ROWS;
        const seats: Seat[] = [];
        const totalCols = SECTION_SIZES.left + SECTION_SIZES.middle + SECTION_SIZES.right;
        for (let col = 0; col < totalCols; col++) {
            const status: SeatStatus = isVipRow
                ? "vip"
                : isUnavailable(row, col)
                    ? "unavailable"
                    : "regular";
            seats.push({ id: `${row}-${col}`, row, seatNumber: col + 1, status });
        }
        rows.push(seats);
    }
    const preselectRow = rows[2];
    const preselectSeat = preselectRow.find((s) => s.status === "regular");
    if (preselectSeat) preselectSeat.status = "selected";
    return rows;
};

const SEAT_COLORS: Record<SeatStatus, string> = {
    unavailable: "#D4D8DE",
    regular: "#6FC3F3",
    vip: "#4B4A9E",
    selected: "#E0A836",
};

const CheckoutScreen = () => {
    const router = useRouter();

    const { title, releaseDate, } = useLocalSearchParams();
    console.log(title, releaseDate);
    const [seatRows, setSeatRows] = useState<Seat[][]>(buildInitialSeats);
    const [scale, setScale] = useState(1);

    const selectedSeats = useMemo(
        () => seatRows.flat().filter((s) => s.status === "selected"),
        [seatRows]
    );

    const totalPrice = useMemo(
        () =>
            selectedSeats.reduce((sum, seat) => {
                // We don't retain the seat's original type once selected,
                // so infer price from position: VIP row seats cost more.
                const price = seat.row === TOTAL_ROWS ? PRICES.vip : PRICES.regular;
                return sum + price;
            }, 0),
        [selectedSeats]
    );

    const toggleSeat = (rowIndex: number, seatIndex: number) => {
        setSeatRows((prev) => {
            const next = prev.map((row) => row.slice());
            const seat = { ...next[rowIndex][seatIndex] };
            if (seat.status === "unavailable") return prev; // can't select unavailable seats

            if (seat.status === "selected") {
                // revert back to its underlying type (vip row vs regular)
                seat.status = seat.row === TOTAL_ROWS ? "vip" : "regular";
            } else {
                seat.status = "selected";
            }
            next[rowIndex][seatIndex] = seat;
            return next;
        });
    };

    const clearSelection = () => {
        setSeatRows((prev) =>
            prev.map((row) =>
                row.map((seat) =>
                    seat.status === "selected"
                        ? { ...seat, status: seat.row === TOTAL_ROWS ? "vip" : "regular" }
                        : seat
                )
            )
        );
    };

    const zoomIn = () => setScale((s) => Math.min(s + 0.15, 1.6));
    const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.7));

    const renderSection = (
        seats: Seat[],
        rowIndex: number,
        startIndex: number
    ) =>
        seats.map((seat, i) => {
            const seatIndex = startIndex + i;
            return (
                <TouchableOpacity
                    key={seat.id}
                    activeOpacity={0.7}
                    disabled={seat.status === "unavailable"}
                    onPress={() => toggleSeat(rowIndex, seatIndex)}
                    style={[styles.seat, { backgroundColor: SEAT_COLORS[seat.status] }]}
                />
            );
        });

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={26} color="#1c1c1e" />
                    </TouchableOpacity>
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle}>{title ?? "The King's Man"}</Text>
                        <Text style={styles.headerSubtitle}>
                            {releaseDate ?? "March 5, 2021"}
                            <Text style={styles.headerDivider}>  |  </Text>
                            {"12:30"} {"Hall 1"}
                        </Text>
                    </View>
                    <View style={{ width: 26 }} />
                </View>
                <View style={styles.mapArea}>
                    <ScrollView
                        contentContainerStyle={styles.mapScrollContent}
                        showsVerticalScrollIndicator={false}

                    >
                        <View style={{ transform: [{ scale }] }}>
                            <CurvedArcHeader arcWidth={350} />
                            <Text style={styles.screenLabel}>SCREEN</Text>
                            {seatRows.map((seats, rowIndex) => {
                                const left = seats.slice(0, SECTION_SIZES.left);
                                const middle = seats.slice(
                                    SECTION_SIZES.left,
                                    SECTION_SIZES.left + SECTION_SIZES.middle
                                );
                                const right = seats.slice(SECTION_SIZES.left + SECTION_SIZES.middle);
                                return (
                                    <View key={rowIndex} style={styles.seatRow}>
                                        <Text style={styles.rowLabel}>{rowIndex + 1}</Text>
                                        <View style={styles.seatSection}>
                                            {renderSection(left, rowIndex, 0)}
                                        </View>
                                        <View style={[styles.seatSection, styles.seatSectionGap]}>
                                            {renderSection(middle, rowIndex, SECTION_SIZES.left)}
                                        </View>
                                        <View style={[styles.seatSection, styles.seatSectionGap]}>
                                            {renderSection(
                                                right,
                                                rowIndex,
                                                SECTION_SIZES.left + SECTION_SIZES.middle
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View style={styles.zoomControls}>
                        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn} activeOpacity={0.7}>
                            <Text style={styles.zoomButtonText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut} activeOpacity={0.7}>
                            <Text style={styles.zoomButtonText}>−</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.scrollBarTrack}>
                        <View style={styles.scrollBarThumb} />
                    </View>
                </View>
                <View style={styles.bottomSheet}>
                    <View style={styles.legendGrid}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendSwatch, { backgroundColor: SEAT_COLORS.selected }]} />
                            <Text style={styles.legendText}>Selected</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendSwatch, { backgroundColor: SEAT_COLORS.unavailable }]} />
                            <Text style={styles.legendText}>Not available</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendSwatch, { backgroundColor: SEAT_COLORS.vip }]} />
                            <Text style={styles.legendText}>VIP ({PRICES.vip}$)</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendSwatch, { backgroundColor: SEAT_COLORS.regular }]} />
                            <Text style={styles.legendText}>Regular ({PRICES.regular}$)</Text>
                        </View>
                    </View>
                    {selectedSeats.length > 0 && (
                        <View style={styles.chipRow}>
                            {selectedSeats.map((seat) => (
                                <View key={seat.id} style={styles.chip}>
                                    <Text style={styles.chipText}>
                                        {seat.seatNumber} / {seat.row} row
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const rowIndex = seat.row - 1;
                                            const seatIndex = seatRows[rowIndex].findIndex(
                                                (s) => s.id === seat.id
                                            );
                                            toggleSeat(rowIndex, seatIndex);
                                        }}
                                        hitSlop={8}
                                    >
                                        <Ionicons name="close" size={16} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                    <View style={styles.footer}>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceLabel}>Total Price</Text>
                            <Text style={styles.priceValue}>$ {totalPrice}</Text>
                        </View>
                        <CustomButton text="Proceed to pay" onPress={() => { }} />
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
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
    headerDivider: {
        color: "#C7CDD6",
    },
    mapArea: {
        flex: 1,
        backgroundColor: "#F2F4F7",
        position: "relative",
    },
    mapScrollContent: {
        paddingTop: 28,
        paddingHorizontal: 12,
        paddingBottom: 40,
        alignItems: "center",
    },
    screenCurve: {
        width: 300,
        height: 34,
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150,
        borderWidth: 1.2,
        borderColor: "#B9CBE0",
        borderBottomWidth: 0,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 4,
        marginBottom: 18,
    },
    screenLabel: {
        fontSize: 10,
        letterSpacing: 2,
        color: "#9AA5B1",
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: -10,
        marginBottom: 10
    },
    seatRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    rowLabel: {
        width: 16,
        fontSize: 11,
        color: "#9AA5B1",
        textAlign: "center",
        marginRight: 6,
    },
    seatSection: {
        flexDirection: "row",
        gap: 4,
    },
    seatSectionGap: {
        marginLeft: 10,
    },
    seat: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    zoomControls: {
        flexDirection: 'row',
        position: "absolute",
        bottom: 40,
        right: 20,
        gap: 10,
    },
    zoomButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    zoomButtonText: {
        fontSize: 20,
        color: "#1c1c1e",
        fontWeight: "600",
    },
    scrollBarTrack: {
        position: "absolute",
        bottom: 12,
        left: 20,
        right: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E3E7EC",
    },
    scrollBarThumb: {
        width: "45%",
        height: 4,
        borderRadius: 2,
        backgroundColor: "#B0B7C1",
    },
    bottomSheet: {
        backgroundColor: "#fff",
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEF0F3",
    },
    legendGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 14,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        gap: 10,
    },
    legendSwatch: {
        width: 22,
        height: 22,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 14,
        minWidth: 100,
        color: "#5B6472",
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 18,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F4F7",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1c1c1e",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 20,
    },
    priceBox: {
        backgroundColor: "#F2F4F7",
        borderRadius: 10,
        minWidth: 100,
        height: 50,
        paddingHorizontal: 16,
        justifyContent: "center",
    },
    priceLabel: {
        fontSize: 12,
        color: "#9AA5B1",
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1c1c1e",
    },
    payButton: {
        flex: 1,
        backgroundColor: "#7FC1EA",
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: "center",
    },
    payButtonDisabled: {
        opacity: 0.5,
    },
    payButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default CheckoutScreen;