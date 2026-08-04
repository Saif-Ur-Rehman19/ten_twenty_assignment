import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";
const CurvedArcHeader = ({ height = 70, strokeColor = '#38bdf8', arcWidth = 160 }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Svg style={{marginTop:-10}} width={arcWidth} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={`M 0 ${height} Q ${width / 2} 0 ${width} ${height}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
})

export default CurvedArcHeader