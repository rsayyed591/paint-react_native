import React, { useCallback, useState } from "react";
import {
  Canvas,
  Path,
  SkPath,
  Skia,
  TouchInfo,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { Pressable, StyleSheet, Text, View } from "react-native";

const App = () => {
  const [paths, setPaths] = useState([]);
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showStrokes, setShowStrokes] = useState(false);

  const onDrawingStart = useCallback((touchInfo) => {
    setPaths((currentPaths) => {
      const { x, y } = touchInfo;
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      return [
        ...currentPaths,
        {
          path: newPath,
          color,
          strokeWidth,
        },
      ];
    });
  }, [color, strokeWidth]);

  const onDrawingActive = useCallback((touchInfo) => {
    setPaths((currentPaths) => {
      const { x, y } = touchInfo;
      const currentPath = currentPaths[currentPaths.length - 1];
      const lastPoint = currentPath.path.getLastPt();
      const xMid = (lastPoint.x + x) / 2;
      const yMid = (lastPoint.y + y) / 2;

      currentPath.path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
      return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
    });
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
    },
    [onDrawingActive, onDrawingStart]
  );

  const clearCanvas = () => {
    setPaths([]);
  };

  return (
    <View style={style.container}>
      <Toolbar
        color={color}
        strokeWidth={strokeWidth}
        setColor={setColor}
        setStrokeWidth={setStrokeWidth}
        showStrokes={showStrokes}
        setShowStrokes={setShowStrokes}
        clearCanvas={clearCanvas}
      />
      <Canvas style={style.canvasContainer} onTouch={touchHandler}>
        {paths.map((path, index) => (
          <Path
            key={index}
            path={path.path}
            color={path.color}
            style={"stroke"}
            strokeWidth={path.strokeWidth}
          />
        ))}
      </Canvas>
      {showStrokes && (
        <View style={[style.toolbar, style.strokeToolbar]}>
          {strokes.map((stroke) => (
            <Pressable
              onPress={() => setStrokeWidth(stroke)}
              key={stroke}
              style={style.strokeOption}
            >
              <Text>{stroke}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const Colors = ["black", "red", "blue", "green", "yellow", "white"];

const strokes = [2, 4, 6, 8, 10, 12, 14, 16];

const Toolbar = ({
  color,
  strokeWidth,
  setColor,
  setStrokeWidth,
  showStrokes,
  setShowStrokes,
  clearCanvas,
}) => {
  const handleChangeColor = (newColor) => {
    setColor(newColor);
  };

  return (
    <View style={style.toolbar}>
      <Pressable
        style={style.currentStroke}
        onPress={() => setShowStrokes(!showStrokes)}
      >
        <Text>{strokeWidth}</Text>
      </Pressable>
      <View style={style.separator} />
      {Colors.map((item) => (
        <ColorButton
          key={item}
          color={item}
          isSelected={color === item}
          onPress={() => handleChangeColor(item)}
        />
      ))}
      <Pressable style={style.clearButton} onPress={clearCanvas}>
        <Text>🗑️</Text>
      </Pressable>
    </View>
  );
};

const ColorButton = ({ color, isSelected, onPress }) => {
  return (
    <Pressable
      style={[
        style.colorButton,
        { backgroundColor: color },
        isSelected && {
          borderWidth: 2,
          borderColor: "black",
        },
      ]}
      onPress={onPress}
    />
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
  },
  canvasContainer: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: "#ffffff",
    height: 50,
    width: 300,
    
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  separator: {
    height: 30,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  currentStroke: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
  },
  strokeToolbar: {
    position: "absolute",
    top: 70,
    justifyContent: "space-between",
    zIndex: 100,
    flexDirection: "row",
    paddingHorizontal: 12,
    alignSelf: "center",
  },
  strokeOption: {
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: "white",
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 15,
  },
});

export default App;

