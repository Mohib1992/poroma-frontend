import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const dot1Opacity = useRef(new Animated.Value(0.4)).current;
  const dot2Opacity = useRef(new Animated.Value(0.7)).current;
  const dot3Opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => animateDots());
    };

    const dotsTimer = setTimeout(() => {
      animateDots();
    }, 1000);

    const navigationTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => {
      clearTimeout(dotsTimer);
      clearTimeout(navigationTimer);
    };
  }, [fadeAnim, scaleAnim, dot1Opacity, dot2Opacity, dot3Opacity, onFinish]);

  return (
    <LinearGradient
      colors={['#002c28', '#00443e']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.glowContainer}>
            <View style={styles.iconBackground}>
              <MaterialCommunityIcons
                name="pill"
                size={48}
                color="#002c28"
                style={styles.icon}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>পরমা</Text>
          <Text style={styles.tagline}>Your daily health companion</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
        <Text style={styles.loadingText}>SECURING YOUR HEALTH DATA</Text>
      </Animated.View>

      <View style={styles.decorativeTop} />
      <View style={styles.decorativeBottom} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  iconContainer: {
    marginBottom: 32,
  },
  glowContainer: {
    position: 'relative',
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
  },
  icon: {
    // @ts-ignore - fontVariationSettings is valid for TextStyle
    fontVariationSettings: "'FILL' 1",
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  appName: {
    fontFamily: 'Manrope',
    fontSize: 57,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  decorativeTop: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(176, 239, 229, 0.05)',
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(158, 238, 228, 0.05)',
  },
});