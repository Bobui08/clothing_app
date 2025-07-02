import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  interpolate,
  Extrapolate,
  runOnJS,
  withRepeat,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DiagonalImageContainer = ({
  imageUri,
  width = 340,
  height = 440,
  borderRadius = 20,
  isActive = false,
}) => {
  // Individual animation values for each element
  const containerScale = useSharedValue(0.3);
  const containerOpacity = useSharedValue(0);
  const containerRotation = useSharedValue(-15);
  const imageScale = useSharedValue(0.8);
  const shadowOpacity = useSharedValue(0);
  const borderAnimation = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Staggered entrance animation
      containerOpacity.value = withTiming(1, { duration: 400 });
      containerScale.value = withSpring(1, {
        damping: 20,
        stiffness: 150,
        duration: 800,
      });
      containerRotation.value = withSpring(0, {
        damping: 25,
        stiffness: 100,
        duration: 1000,
      });

      // Delayed image scale animation
      imageScale.value = withDelay(
        200,
        withSpring(1, {
          damping: 15,
          stiffness: 120,
        })
      );

      // Shadow appears gradually
      shadowOpacity.value = withDelay(300, withTiming(0.3, { duration: 600 }));

      // Border highlight effect
      borderAnimation.value = withDelay(
        400,
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 600 })
        )
      );
    } else {
      // Reset animation when not active
      containerScale.value = 0.3;
      containerOpacity.value = 0;
      containerRotation.value = -15;
      imageScale.value = 0.8;
      shadowOpacity.value = 0;
      borderAnimation.value = 0;
    }
  }, [isActive]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolate(
      borderAnimation.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale: containerScale.value },
        { rotate: `${containerRotation.value}deg` },
      ],
      opacity: containerOpacity.value,
      borderWidth: 2,
      borderColor: `rgba(0, 0, 0, ${borderColor * 0.1})`,
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
    };
  });

  return (
    <View className="w-full max-w-sm mb-8 items-center">
      <Animated.View
        style={[
          containerAnimatedStyle,
          {
            shadowOpacity: shadowOpacity.value,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowRadius: 16,
            elevation: 12,
          },
        ]}
        className="relative"
      >
        <View
          style={{
            width: width,
            height: height,
            borderRadius: borderRadius,
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          <Animated.View style={imageAnimatedStyle}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </Animated.View>

          {/* Diagonal Mask Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
              <Defs>
                <ClipPath id="diagonalClip">
                  <Path
                    d={`M 20 20 L ${width - 20} 20 L ${width - 20} ${
                      height - 60
                    } L 20 ${height - 20} Z`}
                  />
                </ClipPath>
              </Defs>

              <SvgImage
                href={imageUri}
                width={width}
                height={height}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#diagonalClip)"
              />
            </Svg>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const AnimatedDot = ({
  isActive,
  index,
  totalDots,
  isScreenActive = false,
}) => {
  const dotScale = useSharedValue(0);
  const dotOpacity = useSharedValue(0);
  const activeScale = useSharedValue(isActive ? 1 : 0.6);
  const activeOpacity = useSharedValue(isActive ? 1 : 0.5);

  useEffect(() => {
    if (isScreenActive) {
      // Staggered entrance for dots
      const delay = index * 100 + 600; // Start after main content
      dotOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
      dotScale.value = withDelay(
        delay,
        withSpring(1, {
          damping: 18,
          stiffness: 200,
        })
      );
    } else {
      dotScale.value = 0;
      dotOpacity.value = 0;
    }
  }, [isScreenActive, index]);

  useEffect(() => {
    activeScale.value = withSpring(isActive ? 1.2 : 0.8, {
      damping: 15,
      stiffness: 300,
    });
    activeOpacity.value = withTiming(isActive ? 1 : 0.4, { duration: 300 });
  }, [isActive]);

  const dotAnimatedStyle = useAnimatedStyle(() => {
    const width = isActive ? 24 : 8;
    const backgroundColor = isActive ? "#000000" : "#0A97B0";

    return {
      width: withSpring(width, { damping: 15, stiffness: 200 }),
      backgroundColor: withTiming(backgroundColor, { duration: 300 }),
      transform: [{ scale: dotScale.value * activeScale.value }],
      opacity: dotOpacity.value * activeOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        },
        dotAnimatedStyle,
      ]}
    />
  );
};

const carouselData = [
  // Screen 1 - Splash Screen
  {
    type: "splash",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    title: "Fashions",
    subtitle: "My Life My Style",
  },
  // Screen 2
  {
    type: "onboarding",
    image:
      "https://images.unsplash.com/photo-1579493934830-eab45746b51b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjcxfHxGYXNoaW9ufGVufDB8fDB8fHww",
    title: "20% Discount",
    subtitle: "New Arrival Product",
    description:
      "Publish up your selfies to make yourself more beautiful with this app.",
  },
  // Screen 3
  {
    type: "onboarding",
    image:
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    title: "Take Advantage",
    subtitle: "Of The Offer Shopping",
    description:
      "Publish up your selfies to make yourself more beautiful with this app.",
  },
  // Screen 4
  {
    type: "onboarding",
    image:
      "https://plus.unsplash.com/premium_photo-1695575578331-b09400a8a9bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    title: "All Types Offers",
    subtitle: "Within Your Reach",
    description:
      "Publish up your selfies to make yourself more beautiful with this app.",
  },
];

const OnboardingCarousel = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Enhanced shared values for modern animations
  const splashBackgroundScale = useSharedValue(1.2);
  const splashBackgroundOpacity = useSharedValue(0);
  const splashTitleOpacity = useSharedValue(0);
  const splashTitleY = useSharedValue(50);
  const splashSubtitleOpacity = useSharedValue(0);
  const splashSubtitleY = useSharedValue(30);

  // Content animations
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(60);
  const titleScale = useSharedValue(0.8);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(40);
  const descriptionOpacity = useSharedValue(0);
  const descriptionY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.5);
  const buttonRotation = useSharedValue(45);

  // Auto transition from splash screen
  useEffect(() => {
    if (currentIndex === 0) {
      // Enhanced splash screen animation sequence
      splashBackgroundOpacity.value = withTiming(1, { duration: 600 });
      splashBackgroundScale.value = withTiming(1, { duration: 1200 });

      splashTitleOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 800 })
      );
      splashTitleY.value = withDelay(
        400,
        withSpring(0, {
          damping: 20,
          stiffness: 100,
        })
      );

      splashSubtitleOpacity.value = withDelay(
        800,
        withTiming(1, { duration: 600 })
      );
      splashSubtitleY.value = withDelay(
        800,
        withSpring(0, {
          damping: 25,
          stiffness: 120,
        })
      );

      const timer = setTimeout(() => {
        carouselRef.current?.next();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Enhanced content animation when screen changes
  useEffect(() => {
    if (currentIndex > 0) {
      // Reset all animations
      titleOpacity.value = 0;
      titleY.value = 60;
      titleScale.value = 0.8;
      subtitleOpacity.value = 0;
      subtitleY.value = 40;
      descriptionOpacity.value = 0;
      descriptionY.value = 30;
      buttonOpacity.value = 0;
      buttonScale.value = 0.5;
      buttonRotation.value = 45;

      // Staggered entrance animation sequence
      // Title animation
      titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
      titleY.value = withDelay(
        300,
        withSpring(0, {
          damping: 18,
          stiffness: 120,
        })
      );
      titleScale.value = withDelay(
        300,
        withSpring(1, {
          damping: 15,
          stiffness: 200,
        })
      );

      // Subtitle animation
      subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
      subtitleY.value = withDelay(
        500,
        withSpring(0, {
          damping: 20,
          stiffness: 150,
        })
      );

      // Description animation
      descriptionOpacity.value = withDelay(
        700,
        withTiming(1, { duration: 600 })
      );
      descriptionY.value = withDelay(
        700,
        withSpring(0, {
          damping: 22,
          stiffness: 130,
        })
      );

      // Button animation
      buttonOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
      buttonScale.value = withDelay(
        900,
        withSpring(1, {
          damping: 12,
          stiffness: 250,
        })
      );
      buttonRotation.value = withDelay(
        900,
        withSpring(0, {
          damping: 20,
          stiffness: 150,
        })
      );
    }
  }, [currentIndex]);

  const handleNext = () => {
    // Enhanced button press animation
    buttonScale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );
    buttonRotation.value = withSequence(
      withTiming(10, { duration: 100 }),
      withSpring(0, { duration: 200 })
    );

    if (currentIndex < carouselData.length - 1) {
      carouselRef.current?.next();
    } else {
      try {
        router.push({ pathname: "/(tabs)" });
      } catch (error) {
        console.log("Navigation error:", error);
        router.push("/");
      }
    }
  };

  // Enhanced animated styles
  const splashBackgroundStyle = useAnimatedStyle(() => ({
    opacity: splashBackgroundOpacity.value,
    transform: [{ scale: splashBackgroundScale.value }],
  }));

  const splashTitleStyle = useAnimatedStyle(() => ({
    opacity: splashTitleOpacity.value,
    transform: [{ translateY: splashTitleY.value }],
  }));

  const splashSubtitleStyle = useAnimatedStyle(() => ({
    opacity: splashSubtitleOpacity.value,
    transform: [{ translateY: splashSubtitleY.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }, { scale: titleScale.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));

  const descriptionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
    transform: [{ translateY: descriptionY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      { scale: buttonScale.value },
      { rotate: `${buttonRotation.value}deg` },
    ],
  }));

  const renderSplashScreen = (item) => (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          splashBackgroundStyle,
          { position: "absolute", width: "100%", height: "100%" },
        ]}
      >
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Animated.View>
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        className="flex-1 justify-center items-center"
      >
        <View className="items-center">
          <Animated.View style={splashTitleStyle}>
            <Text
              className="text-white text-5xl font-light mb-2"
              style={{ fontFamily: "serif", letterSpacing: 2 }}
            >
              {item.title}
            </Text>
          </Animated.View>
          <Animated.View style={splashSubtitleStyle}>
            <Text className="text-white text-xl opacity-90 tracking-wide">
              {item.subtitle}
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderOnboardingScreen = (item, index) => (
    <View className="flex-1 bg-white">
      <View className="justify-center items-center px-6 pt-8">
        {/* Enhanced Diagonal Image Section */}
        <DiagonalImageContainer
          imageUri={item.image}
          isActive={currentIndex === index}
        />

        {/* Enhanced Animated Content */}
        <View className="w-full max-w-sm mt-10">
          {/* Enhanced Title Animation */}
          <Animated.View style={titleAnimatedStyle} className="mb-6">
            <Text className="text-4xl font-extrabold text-gray-900 mb-1 text-center">
              {item.title}
            </Text>
          </Animated.View>

          {/* Enhanced Subtitle Animation */}
          <Animated.View style={subtitleAnimatedStyle} className="mb-4">
            <Text className="text-4xl font-extrabold text-gray-900 text-center">
              {item.subtitle}
            </Text>
          </Animated.View>

          {/* Enhanced Description Animation */}
          <Animated.View style={descriptionAnimatedStyle}>
            <Text className="text-gray-500 text-xl leading-6 text-center">
              {item.description}
            </Text>
          </Animated.View>

          {/* Enhanced Controls Section */}
          <View className="flex-row justify-between items-center mt-12">
            {/* Enhanced Animated Dots */}
            <View className="flex-row justify-start">
              {carouselData.slice(1).map((_, dotIndex) => (
                <AnimatedDot
                  key={dotIndex}
                  isActive={dotIndex === index - 1}
                  index={dotIndex}
                  totalDots={carouselData.length - 1}
                  isScreenActive={currentIndex === index}
                />
              ))}
            </View>

            {/* Enhanced Button Animation */}
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                onPress={handleNext}
                className="w-16 h-16 bg-black rounded-full justify-center items-center shadow-lg"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View className="flex-row items-center justify-center">
                  <View
                    style={{
                      width: 8,
                      height: 2,
                      backgroundColor: "white",
                      marginRight: 3,
                    }}
                  />
                  <FontAwesome6 name="play" size={14} color="white" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    if (item.type === "splash") {
      return renderSplashScreen(item);
    }
    return renderOnboardingScreen(item, index);
  };

  return (
    <View className="flex-1">
      <Carousel
        ref={carouselRef}
        data={carouselData}
        renderItem={renderItem}
        width={screenWidth}
        height={screenHeight}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setCurrentIndex(index)}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        enabled={currentIndex > 0}
        // Enhanced custom page animation
        customAnimation={(value) => {
          "worklet";

          const safeValue = Math.max(-2, Math.min(2, value || 0));

          const zIndex = interpolate(
            safeValue,
            [-1, 0, 1],
            [300, 0, -300],
            Extrapolate.CLAMP
          );

          const translateX = interpolate(
            safeValue,
            [-1, 0, 1],
            [-screenWidth * 0.15, 0, screenWidth * 0.15],
            Extrapolate.CLAMP
          );

          const scale = interpolate(
            safeValue,
            [-1, 0, 1],
            [0.85, 1, 0.85],
            Extrapolate.CLAMP
          );

          const opacity = interpolate(
            safeValue,
            [-1, -0.3, 0, 0.3, 1],
            [0, 0.7, 1, 0.7, 0],
            Extrapolate.CLAMP
          );

          const rotateY = interpolate(
            safeValue,
            [-1, 0, 1],
            [-15, 0, 15],
            Extrapolate.CLAMP
          );

          return {
            transform: [
              { translateX: isFinite(translateX) ? translateX : 0 },
              { scale: isFinite(scale) ? Math.max(0.1, scale) : 1 },
              { rotateY: `${isFinite(rotateY) ? rotateY : 0}deg` },
            ],
            zIndex: isFinite(zIndex) ? Math.round(zIndex) : 0,
            opacity: isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1,
          };
        }}
      />
    </View>
  );
};

export default OnboardingCarousel;
