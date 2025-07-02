import React from "react";
import { SafeAreaView } from "react-native";
import OnboardingCarousel from "@/components/ui/OnboardingCarousel";

export default function Onboarding() {
  return (
    <SafeAreaView className="flex-1">
      <OnboardingCarousel />
    </SafeAreaView>
  );
}
