// =============================== // backend/index.js (Express Server) // =============================== const express = require('express'); const cors = require('cors'); const app = express();

app.use(cors());

const sampleData = { '24h': { labels: ['1h', '3h', '6h', '12h', '24h'], values: [100, 110, 105, 115, 120], }, '7d': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [110, 120, 115, 130, 125, 140, 150], }, '30d': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [400, 450, 470, 500], } };

app.get('/investments', (req, res) => { const { range } = req.query; const data = sampleData[range] || sampleData['7d']; res.json(data); });

const PORT = process.env.PORT || 3000; app.listen(PORT, () => { console.log(CryptoAccess Pro backend running on port ${PORT}); });

// =============================== // frontend/theme.js // =============================== import { useColorScheme } from 'react-native';

export const useAppTheme = () => { const scheme = useColorScheme(); const isDark = scheme === 'dark';

return { isDark, colors: { background: isDark ? '#121212' : '#ffffff', text: isDark ? '#ffffff' : '#000000', } }; };

// =============================== // frontend/security.js // =============================== import { Platform } from 'react-native';

export const checkSecureConnection = async () => { if (Platform.OS === 'android' || Platform.OS === 'ios') { return true; } const isSecure = window.location.protocol === 'https:'; return isSecure; };

// =============================== // frontend/InvestmentChart.js // =============================== import React, { useState, useEffect } from 'react'; import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity, Button } from 'react-native'; import { LineChart } from 'react-native-chart-kit'; import axios from 'axios'; import { checkSecureConnection } from './security'; import { useAppTheme } from './theme';

const API_URL = 'http://localhost:3000/investments'; // Change to deployed URL if needed

const InvestmentChart = () => { const [chartData, setChartData] = useState(null); const [timeframe, setTimeframe] = useState('7d'); const [loading, setLoading] = useState(true); const { colors, isDark } = useAppTheme();

useEffect(() => { checkSecurity(); }, []);

const checkSecurity = async () => { if (!(await checkSecureConnection())) { Alert.alert('Security Alert', 'Unsecured connection detected. Chart disabled.', [{ text: 'OK', style: 'cancel' }]); return; } fetchChartData(); };

const fetchChartData = async () => { try { setLoading(true); const { data } = await axios.get(${API_URL}?range=${timeframe}); setChartData({ labels: data.labels, datasets: [{ data: data.values, color: (opacity = 1) => isDark ? rgba(240, 185, 11, ${opacity}) : '#f0b90b', strokeWidth: 2 }] }); } catch (error) { Alert.alert('Crypto Data Error', 'Failed to load investment trends', [{ text: 'Retry', onPress: fetchChartData }]); } finally { setLoading(false); } };

const handleTimeframeChange = (newTimeframe) => { setTimeframe(newTimeframe); fetchChartData(); };

const chartConfig = { backgroundGradientFrom: colors.background, backgroundGradientTo: colors.background, decimalPlaces: 2, color: (opacity = 1) => isDark ? rgba(255, 255, 255, ${opacity}) : rgba(0, 0, 0, ${opacity}), labelColor: (opacity = 1) => isDark ? rgba(255, 255, 255, ${opacity}) : rgba(0, 0, 0, ${opacity}), style: { borderRadius: 16 }, propsForDots: { r: '4', strokeWidth: '2', stroke: isDark ? '#FFD700' : '#f0b90b' } };

if (loading) { return ( <View style={styles.center}> <ActivityIndicator size="large" color="#f0b90b" /> <Text style={{ color: colors.text }}>Loading crypto data...</Text> </View> ); }

return ( <View style={styles.container}> <Text style={[styles.title, { color: colors.text }]}>Crypto Investment Trends</Text> <TimeframeSelector timeframe={timeframe} onChange={handleTimeframeChange} /> {chartData ? ( <LineChart data={chartData} width={Dimensions.get('window').width - 32} height={220} chartConfig={chartConfig} bezier style={styles.chart} withVerticalLabels withHorizontalLabels getDotColor={() => isDark ? '#FFD700' : '#f0b90b'} /> ) : ( <ErrorMessage onRetry={fetchChartData} /> )} </View> ); };

const TimeframeSelector = ({ timeframe, onChange }) => ( <View style={styles.timeframeContainer}> {['24h', '7d', '30d'].map((t) => ( <TouchableOpacity key={t} style={[styles.timeframeButton, timeframe === t && styles.activeButton]} onPress={() => onChange(t)} > <Text style={[styles.buttonText, timeframe === t && styles.activeText]}>{t.toUpperCase()}</Text> </TouchableOpacity> ))} </View> );

const ErrorMessage = ({ onRetry }) => ( <View style={styles.center}> <Text style={styles.errorText}>⚠️ Data Load Failed</Text> <Button title="Retry" onPress={onRetry} color="#f0b90b" /> </View> );

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' }, chart: { marginVertical: 8, borderRadius: 16 }, timeframeContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }, timeframeButton: { paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 8, backgroundColor: 'rgba(240, 185, 11, 0.1)' }, activeButton: { backgroundColor: '#f0b90b' }, buttonText: { color: '#f0b90b', fontWeight: '500' }, activeText: { color: 'white' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, errorText: { color: '#e74c3c', marginBottom: 8 } });

export default InvestmentChart;

