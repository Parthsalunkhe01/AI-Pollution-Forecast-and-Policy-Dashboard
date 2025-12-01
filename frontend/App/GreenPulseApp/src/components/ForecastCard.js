// src/components/ForecastCard.js
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const SCREEN = Dimensions.get('window');
const CARD_WIDTH = SCREEN.width - (SPACING.md * 2);

export default function ForecastCard({
  points = [340, 355, 320, 300, 280, 250, 230, 210, 200], // length can be 9/12 etc — ideally 9 points for 0..24 step=3
  onPointPress = () => {}
}) {
  // labels we must show on X axis: 0 3 6 9 12 15 18 21 24
  // ensure points length matches labels count (9). If not, we still distribute across.
  const labels = ['0','3','6','9','12','15','18','21','24'];
  const usedLen = Math.max(2, points.length);
  const max = Math.max(...points);
  const min = Math.min(...points);

  const leftPadding = 24; // keep dots inside card
  const rightPadding = 24;
  const availableW = CARD_WIDTH - leftPadding - rightPadding;
  const plotHeight = 110;
  const dotSize = 10;

  // tooltip state
  const [tooltip, setTooltip] = useState(null); // { idx, value, left, top }
  const hideTimer = useRef(null);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  function showTooltip(idx, value, left, top) {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setTooltip({ idx, value, left, top });
    hideTimer.current = setTimeout(() => setTooltip(null), 2000);
  }

  // compute x position for index i
  function xForIndex(i) {
    return leftPadding + (i / Math.max(1, (usedLen - 1))) * availableW;
  }
  // compute top percent for value
  function yForValue(v) {
    const norm = (v - min) / (max - min || 1);
    const y = (1 - norm) * plotHeight; // px from top
    return y;
  }

  return (
    <View style={styles.card}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{fontWeight:'700'}}>AI Forecast (24h)</Text>
        <View style={{backgroundColor:'#E6F9F0', paddingVertical:6, paddingHorizontal:8, borderRadius:12}}>
          <Text style={{color:COLORS.primary, fontSize:12}}>94% Accuracy</Text>
        </View>
      </View>

      <View style={{ marginTop: SPACING.sm }}>
        <View style={{ flexDirection:'row' }}>
          {/* Y axis ticks on left */}
          <View style={{ width:56, justifyContent:'space-between', paddingVertical:8 }}>
            {/* 5 ticks */}
            {Array.from({length:5}).map((_,i) => {
              const tickVal = Math.round(max - ((max - min) / 4) * i);
              return <Text key={i} style={{ color:'#9CA3AF', fontSize:12 }}>{tickVal}</Text>;
            })}
          </View>

          <View style={{ flex:1 }}>
            {/* horizontal grid lines */}
            <View style={{ position:'absolute', left:0, right:0, top:18, height: plotHeight, justifyContent:'space-between' }}>
              {Array.from({ length:5 }).map((_,i) => (
                <View key={i} style={{ borderTopWidth:1, borderColor:'#F1F5F9' }} />
              ))}
            </View>

            {/* plotting area */}
            <View style={{ height: plotHeight + 10, paddingLeft: leftPadding, paddingRight: rightPadding }}>
              {/* dots */}
              {points.map((p, i) => {
                // clamp value
                const v = p;
                const left = xForIndex(i);
                const top = yForValue(v);
                // ensure dot stays inside bounds: left between leftPadding and leftPadding+availableW
                const clampedLeft = Math.max(leftPadding, Math.min(leftPadding + availableW, left));
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      position: 'absolute',
                      left: clampedLeft - dotSize/2,
                      top: top - dotSize/2,
                      width: dotSize,
                      height: dotSize,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() => {
                      // show tooltip; compute tooltip left and top relative to container
                      showTooltip(i, v, clampedLeft, top);
                      onPointPress(v, i);
                    }}
                    activeOpacity={0.9}
                  >
                    <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize/2, backgroundColor: COLORS.primary }} />
                  </TouchableOpacity>
                );
              })}

              {/* tooltip */}
              {tooltip && (
                <View style={{
                  position:'absolute',
                  left: Math.max(8, tooltip.left - 30),
                  top: Math.max(0, tooltip.top - 40),
                  backgroundColor:'#fff',
                  paddingHorizontal:8,
                  paddingVertical:6,
                  borderRadius:8,
                  elevation:3,
                  shadowColor:'#000',
                  shadowOpacity:0.06,
                  shadowOffset:{width:0,height:4}
                }}>
                  <Text style={{ fontWeight:'800', color: COLORS.primary }}>{tooltip.value}</Text>
                </View>
              )}
            </View>

            {/* X axis labels: show fixed 9 labels 0..24 evenly spaced */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:8, paddingLeft: leftPadding, paddingRight: rightPadding }}>
              {labels.map((lab, i) => (
                <Text key={i} style={{ fontSize:12, color:'#9CA3AF' }}>{lab}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', padding: SPACING.md, borderRadius: RADIUS.md, marginTop: SPACING.md },
});
