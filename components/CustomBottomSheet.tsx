import { StyleSheet } from "react-native";
import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface Props {
  onDismiss: any;
  children?: ReactNode;
}

type Ref = BottomSheetModal;

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const theme = useColorScheme();
  const colorScheme = useColorScheme();
  const { onDismiss, children } = props;

  const handleSheetChange = useCallback((index: number) => {}, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModal
        ref={ref}
        index={0}
        enablePanDownToClose={true}
        onChange={handleSheetChange}
        snapPoints={["80%"]}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        handleIndicatorStyle={{
          display: "flex",
          width: "20%",
          backgroundColor: theme === "light" ? "#e0e0e0" : "#ccc",
        }}
        onDismiss={() => onDismiss()}
        backgroundStyle={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        {children}
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
});

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    // paddingBottom: 80,
    // paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "MuliBold",
    paddingBottom: 10,
    borderBottomWidth: 2,
    textAlign: "center",
    width: "100%",
  },
  subText: {
    fontSize: 16,
    fontFamily: "Muli",
    color: "#888",
    textAlign: "center",
    paddingTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  yesButton: {
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    flex: 1,
    backgroundColor: "#5A55CA",
  },
  input: {
    width: "100%",
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
});
