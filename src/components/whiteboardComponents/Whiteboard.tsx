import React, { useEffect, useMemo, useRef, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';
import RNPickerSelect from 'react-native-picker-select';
import { createThemedPickerSelectStyles, getModalBodyTheme } from '../../components_modern/core/modalBodyTheme';

const EMPTY_BOARD_ITEMS: any[] = [];

type WhiteboardTool = 'draw' | 'freehand' | 'shape' | 'erase' | 'text' | 'select' | 'pan';
type WhiteboardShapeType =
  | 'square'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'hexagon'
  | 'pentagon'
  | 'rhombus'
  | 'octagon'
  | 'parallelogram'
  | 'oval'
  | 'line';
type WhiteboardLineType = 'solid' | 'dashed' | 'dotted' | 'dashDot';
type WhiteboardSettingsPanel = 'draw' | 'freehand' | 'shape' | 'erase' | 'text' | 'image';
type ToolSettingsPanel = Exclude<WhiteboardSettingsPanel, 'image'>;

const LINE_THICKNESS_OPTIONS = [3, 6, 12, 18, 24, 36];
const BRUSH_THICKNESS_OPTIONS = [5, 10, 20, 40, 60];
const ERASER_THICKNESS_OPTIONS = [5, 10, 20, 30, 60];
const FONT_SIZE_OPTIONS = [10, 16, 20, 32, 48, 60];
const FONT_FAMILY_OPTIONS = [
  { label: 'System', value: 'System' },
  { label: 'Sans', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'monospace' },
];
const LINE_TYPE_OPTIONS: Array<{ label: string; value: WhiteboardLineType }> = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dash', value: 'dashed' },
  { label: 'Dot', value: 'dotted' },
  { label: 'Mix', value: 'dashDot' },
];

const DEFAULT_BOARD_SIZE = { width: 1280, height: 720 };
const HIGH_RES_BOARD_SIZE = { width: 1920, height: 1080 };

const getTextContent = (value: any) => (
  typeof value === 'string' ? value.replace(/\r/g, '') : ''
);

const getTextMetrics = (shape: any) => {
  const fontPx = Math.max(10, shape?.fontSize || 20);
  const lines = getTextContent(shape?.text).split('\n');
  const longestLine = lines.reduce((maxLength, line) => Math.max(maxLength, line.length), 0);

  return {
    width: Math.max(longestLine * fontPx * 0.58, fontPx * 0.9, 32),
    height: Math.max(lines.length * fontPx * 1.2, 16),
  };
};

const DarkPickerChevronIcon = () => <FontAwesome5 name="chevron-down" size={12} color="#e2e8f0" />;
const LightPickerChevronIcon = () => <FontAwesome5 name="chevron-down" size={12} color="#475569" />;

const Whiteboard = (props: any) => {
  const {
    isWhiteboardModalVisible,
    isVisible,
    onWhiteboardClose,
    parameters = {},
  } = props;

  const visible = Boolean(isWhiteboardModalVisible ?? isVisible);
  const useInlineLayout = isWhiteboardModalVisible === undefined;
  const compactInlineToolbar = useInlineLayout;
  const isDarkMode = typeof props.isDarkMode === 'boolean'
    ? props.isDarkMode
    : typeof parameters?.isDarkModeValue === 'boolean'
      ? parameters.isDarkModeValue
      : true;
  const theme = getModalBodyTheme(isDarkMode);
  const compactPickerTheme = useMemo(() => {
    const baseStyles = createThemedPickerSelectStyles(theme);

    return {
      ...baseStyles,
      inputIOS: {
        ...baseStyles.inputIOS,
        fontSize: 12,
        minHeight: 38,
        paddingVertical: 8,
        paddingHorizontal: 10,
        paddingRight: 28,
        borderRadius: 10,
      },
      inputAndroid: {
        ...baseStyles.inputAndroid,
        fontSize: 12,
        minHeight: 38,
        paddingVertical: 8,
        paddingHorizontal: 10,
        paddingRight: 28,
        borderRadius: 10,
        marginVertical: 0,
      },
      inputWeb: {
        ...baseStyles.inputWeb,
        fontSize: 12,
        minHeight: 38,
        paddingVertical: 7,
        paddingHorizontal: 10,
        paddingRight: 28,
        borderRadius: 10,
        marginBottom: 0,
      },
      iconContainer: {
        top: 12,
        right: 10,
      },
      viewContainer: {
        minWidth: 84,
      },
    } as any;
  }, [theme]);

  const {
    socket,
    roomName,
    islevel,
    member,
    targetResolution,
    targetResolutionHost,
    whiteboardStarted,
    whiteboardEnded,
    whiteboardUsers = EMPTY_BOARD_ITEMS,
    shapes = EMPTY_BOARD_ITEMS,
    redoStack = EMPTY_BOARD_ITEMS,
    undoStack = EMPTY_BOARD_ITEMS,
    useImageBackground,
    recordStarted,
    recordStopped,
    recordPaused,
    recordResumed,
    recordingMediaOptions,

    updateShapes,
    updateUseImageBackground,
    updateRedoStack,
    updateUndoStack,
    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateParticipants,
    updateScreenId,
    updateShareScreenStarted,
    updateIsWhiteboardModalVisible,

    onScreenChanges,
    captureCanvasStream,
    showAlert,
  } = parameters;

  const [actionStatus, setActionStatus] = useState('Awaiting actions');
  const [localShapes, setLocalShapes] = useState<any[]>(Array.isArray(shapes) ? shapes : []);
  const [localRedo, setLocalRedo] = useState<any[]>(Array.isArray(redoStack) ? redoStack : []);
  const [localUndo, setLocalUndo] = useState<any[]>(Array.isArray(undoStack) ? undoStack : []);
  const [tool, setTool] = useState<WhiteboardTool>('draw');
  const [shapeType, setShapeType] = useState<WhiteboardShapeType>('rectangle');
  const [lineType, setLineType] = useState<WhiteboardLineType>('solid');
  const [lineThickness, setLineThickness] = useState(6);
  const [brushThickness, setBrushThickness] = useState(10);
  const [eraserThickness, setEraserThickness] = useState(20);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('System');
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [expandedPanel, setExpandedPanel] = useState<WhiteboardSettingsPanel | null>(null);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [penColor, setPenColor] = useState('#0ea5e9');
  const [surfaceSize, setSurfaceSize] = useState({ width: 1, height: 1 });
  const [draftPoints, setDraftPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isTextEditorVisible, setIsTextEditorVisible] = useState(false);
  const [textDraftValue, setTextDraftValue] = useState('');
  const [textDraftPoint, setTextDraftPoint] = useState<{ x: number; y: number } | null>(null);
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragPointRef = useRef<{ x: number; y: number } | null>(null);

  const boardSize = useMemo(
    () => (
      targetResolution === 'qhd'
      || targetResolutionHost === 'qhd'
      || targetResolution === 'fhd'
      || targetResolutionHost === 'fhd'
        ? HIGH_RES_BOARD_SIZE
        : DEFAULT_BOARD_SIZE
    ),
    [targetResolution, targetResolutionHost],
  );

  const fitScale = useMemo(() => {
    if (surfaceSize.width <= 1 || surfaceSize.height <= 1) {
      return 1;
    }

    return Math.min(
      surfaceSize.width / boardSize.width,
      surfaceSize.height / boardSize.height,
    );
  }, [boardSize.height, boardSize.width, surfaceSize.height, surfaceSize.width]);

  const boardRenderScale = useMemo(
    () => Math.max(fitScale * zoomScale, 0.01),
    [fitScale, zoomScale],
  );

  const boardBaseOffset = useMemo(
    () => ({
      x: Math.max(0, (surfaceSize.width - boardSize.width * boardRenderScale) / 2),
      y: Math.max(0, (surfaceSize.height - boardSize.height * boardRenderScale) / 2),
    }),
    [boardRenderScale, boardSize.height, boardSize.width, surfaceSize.height, surfaceSize.width],
  );

  const toolOptions: Array<{ key: WhiteboardTool; label: string; icon: string }> = [
    { key: 'draw', label: 'Line', icon: 'pencil-alt' },
    { key: 'freehand', label: 'Brush', icon: 'paint-brush' },
    { key: 'shape', label: 'Shape', icon: 'draw-polygon' },
    { key: 'select', label: 'Select', icon: 'mouse-pointer' },
    { key: 'erase', label: 'Erase', icon: 'eraser' },
    { key: 'pan', label: 'Pan', icon: 'hand-paper' },
    { key: 'text', label: 'Text', icon: 'font' },
  ];
  const shapeOptions: Array<{ key: WhiteboardShapeType; label: string; icon: string }> = [
    { key: 'square', label: 'Square', icon: 'square' },
    { key: 'rectangle', label: 'Rect', icon: 'vector-square' },
    { key: 'circle', label: 'Circle', icon: 'circle' },
    { key: 'triangle', label: 'Tri', icon: 'play' },
    { key: 'rhombus', label: 'Rhombus', icon: 'gem' },
    { key: 'pentagon', label: 'Pent', icon: 'draw-polygon' },
    { key: 'hexagon', label: 'Hex', icon: 'certificate' },
    { key: 'octagon', label: 'Oct', icon: 'stop' },
    { key: 'parallelogram', label: 'Para', icon: 'italic' },
    { key: 'oval', label: 'Oval', icon: 'circle-notch' },
    { key: 'line', label: 'Line', icon: 'minus' },
  ];

  const toolSupportsPanel = (value: WhiteboardTool): value is ToolSettingsPanel => (
    value === 'draw'
    || value === 'freehand'
    || value === 'shape'
    || value === 'erase'
    || value === 'text'
  );

  const handleToolPress = (nextTool: WhiteboardTool) => {
    setTool(nextTool);
    if (compactInlineToolbar) {
      setExpandedPanel(null);
      return;
    }
    if (toolSupportsPanel(nextTool)) {
      setExpandedPanel((previous) => (
        previous === nextTool && tool === nextTool ? null : nextTool
      ));
      return;
    }
    setExpandedPanel(null);
  };

  const draftShape = useMemo(() => {
    if (tool !== 'shape' || draftPoints.length < 2) {
      return null;
    }

    return {
      type: shapeType,
      x1: draftPoints[0].x,
      y1: draftPoints[0].y,
      x2: draftPoints[1].x,
      y2: draftPoints[1].y,
      color: penColor,
      thickness: lineThickness,
      lineType,
    };
  }, [draftPoints, lineThickness, lineType, penColor, shapeType, tool]);

  const toggleExpandedPanel = (panel: WhiteboardSettingsPanel) => {
    setExpandedPanel((previous) => (previous === panel ? null : panel));
  };

  const handlePenColorSelect = ({ hex }: { hex: string }) => {
    setPenColor(hex);
    setActionStatus(`Color ${hex.toUpperCase()}`);
  };

  const canEdit = useMemo(() => {
    if (islevel === '2') {
      return true;
    }
    return Boolean(whiteboardUsers.find((user: any) => user?.name === member && user?.useBoard));
  }, [islevel, member, whiteboardUsers]);

  const notify = (
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info' = 'info',
  ) => {
    if (typeof showAlert === 'function') {
      showAlert({ message, type });
    }
    setActionStatus(message);
  };

  const handleBoardLayout = (width: number, height: number) => {
    const nextWidth = Math.max(1, Math.round(width));
    const nextHeight = Math.max(1, Math.round(height));

    setSurfaceSize((previous) => {
      if (Math.abs(previous.width - nextWidth) < 1 && Math.abs(previous.height - nextHeight) < 1) {
        return previous;
      }

      return { width: nextWidth, height: nextHeight };
    });
  };

  const syncShapes = (next: any[]) => {
    setLocalShapes(next);
    updateShapes?.(next);
  };

  const syncRedo = (next: any[]) => {
    setLocalRedo(next);
    updateRedoStack?.(next);
  };

  const syncUndo = (next: any[]) => {
    setLocalUndo(next);
    updateUndoStack?.(next);
  };

  const handleServerResponse = (response: { success?: boolean; reason?: string }) => {
    if (!response?.success) {
      notify(`Whiteboard action failed: ${response?.reason || 'unknown reason'}`, 'danger');
    }
  };

  const normalizeIncomingShape = (action: string, payload: any) => {
    if (action === 'draw' || action === 'shape') {
      return {
        type: payload?.type || (action === 'draw' ? 'freehand' : 'line'),
        ...payload,
      };
    }

    if (action === 'text') {
      const nextText = getTextContent(payload?.text).trim();
      if (!nextText) {
        return null;
      }

      return {
        type: 'text',
        ...payload,
        text: nextText,
      };
    }

    return null;
  };

  const eraseShapesAt = (targetX: number, targetY: number, radius = 20) => {
    const within = (x: number, y: number) => {
      const dx = x - targetX;
      const dy = y - targetY;
      return dx * dx + dy * dy <= radius * radius;
    };

    return localShapes.filter((shape: any) => {
      if (shape?.type === 'freehand' && Array.isArray(shape.points)) {
        return !shape.points.some((p: any) => within(p?.x || 0, p?.y || 0));
      }

      if (shape?.type === 'text') {
        return !within(shape?.x || 0, shape?.y || 0);
      }

      const x1 = shape?.x1 || 0;
      const y1 = shape?.y1 || 0;
      const x2 = shape?.x2 ?? x1;
      const y2 = shape?.y2 ?? y1;
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;

      return !within(cx, cy);
    });
  };

  const applyBoardAction = (action: string, payload: any) => {
    const sameShape = (left: any, right: any) => {
      if (!left || !right) {
        return false;
      }
      if (left === right) {
        return true;
      }
      return (
        left.type === right.type &&
        left.src === right.src &&
        left.text === right.text &&
        left.x === right.x &&
        left.y === right.y &&
        left.x1 === right.x1 &&
        left.y1 === right.y1 &&
        left.x2 === right.x2 &&
        left.y2 === right.y2
      );
    };

    switch (action) {
      case 'draw':
      case 'shape':
      case 'text': {
        const shape = fitShapeWithinBoard(normalizeIncomingShape(action, payload));
        if (!shape) {
          return;
        }
        syncShapes([...localShapes, shape]);
        break;
      }
      case 'erase': {
        const nextShapes = eraseShapesAt(payload?.x || 0, payload?.y || 0, payload?.size || 20);
        syncShapes(nextShapes);
        break;
      }
      case 'clear': {
        syncShapes([]);
        syncRedo([]);
        syncUndo([]);
        break;
      }
      case 'uploadImage': {
        if (payload && typeof payload === 'object') {
          const nextShape = fitShapeWithinBoard({ type: 'image', ...payload });
          if (nextShape) {
            syncShapes([...localShapes, nextShape]);
          }
        }
        break;
      }
      case 'undo': {
        if (localShapes.length < 1) {
          return;
        }
        const nextShapes = [...localShapes];
        const removed = nextShapes.pop();
        syncShapes(nextShapes);
        syncRedo([...(localRedo || []), removed]);
        syncUndo([...(localUndo || []), 'undo']);
        break;
      }
      case 'redo': {
        if (localRedo.length < 1) {
          return;
        }
        const nextRedo = [...localRedo];
        const restored = nextRedo.pop();
        syncRedo(nextRedo);
        syncShapes([...(localShapes || []), restored]);
        syncUndo([...(localUndo || []), 'redo']);
        break;
      }
      case 'toggleBackground': {
        const nextValue = typeof payload === 'boolean' ? payload : !useImageBackground;
        updateUseImageBackground?.(nextValue);
        break;
      }
      case 'deleteShape': {
        if (typeof payload?.index === 'number') {
          syncShapes(localShapes.filter((_shape: any, index: number) => index !== payload.index));
        } else if (payload && typeof payload === 'object') {
          syncShapes(localShapes.filter((shape: any) => !sameShape(shape, payload)));
        }
        break;
      }
      case 'shapes': {
        if (payload?.shapes && Array.isArray(payload.shapes)) {
          syncShapes(payload.shapes.map((shape: any) => fitShapeWithinBoard(shape)).filter(Boolean));
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') {
      return;
    }

    const handleWhiteboardAction = (data: { action: string; payload: any }) => {
      const { action, payload } = data || {};
      applyBoardAction(action, payload);
      setActionStatus(`Last action: ${action || 'unknown'}`);
    };

    const handleWhiteboardUpdated = async (data: any) => {
      try {
        if (islevel === '2' && data?.members) {
          const filteredParticipants = data.members.filter(
            (participant: any) => !participant?.isBanned,
          );
          updateParticipants?.(filteredParticipants);
        }

        updateWhiteboardUsers?.(data?.whiteboardUsers || []);

        if (data?.whiteboardData && typeof data.whiteboardData === 'object') {
          if (Array.isArray(data.whiteboardData.shapes)) {
            syncShapes(
              data.whiteboardData.shapes
                .map((shape: any) => fitShapeWithinBoard(shape))
                .filter(Boolean),
            );
          }

          if (typeof data.whiteboardData.useImageBackground === 'boolean') {
            updateUseImageBackground?.(data.whiteboardData.useImageBackground);
          } else {
            updateUseImageBackground?.(true);
          }

          if (Array.isArray(data.whiteboardData.redoStack)) {
            syncRedo(data.whiteboardData.redoStack);
          }

          if (Array.isArray(data.whiteboardData.undoStack)) {
            syncUndo(data.whiteboardData.undoStack);
          }
        }

        if (data?.status === 'started' && !whiteboardStarted) {
          updateWhiteboardStarted?.(true);
          updateWhiteboardEnded?.(false);

          const nextScreenId = `whiteboard-${roomName}`;
          updateScreenId?.(nextScreenId);

          if (islevel !== '2') {
            updateShareScreenStarted?.(true);
            await onScreenChanges?.({ changed: true, parameters });
          }
        } else if (data?.status === 'ended') {
          const prevWhiteboardEnded = whiteboardEnded;
          const prevWhiteboardStarted = whiteboardStarted;

          updateWhiteboardStarted?.(false);
          updateWhiteboardEnded?.(true);

          if (!(islevel === '2' && prevWhiteboardEnded)) {
            updateShareScreenStarted?.(false);
            updateScreenId?.('');
            await onScreenChanges?.({ changed: true, parameters });
          }

          if (
            prevWhiteboardStarted &&
            islevel === '2' &&
            (recordStarted || recordResumed) &&
            !(recordPaused || recordStopped) &&
            recordingMediaOptions === 'video'
          ) {
            await captureCanvasStream?.({ parameters, start: false });
          }
        } else if (data?.status === 'started' && whiteboardStarted) {
          updateWhiteboardStarted?.(true);
          updateWhiteboardEnded?.(false);
          updateShareScreenStarted?.(true);
          updateScreenId?.(`whiteboard-${roomName}`);
          await onScreenChanges?.({ changed: true, parameters });
        }
      } catch (error) {
        console.error('Error in whiteboardUpdated:', error);
      }
    };

    socket.on('whiteboardAction', handleWhiteboardAction);
    socket.on('whiteboardUpdated', handleWhiteboardUpdated);

    return () => {
      if (typeof socket.off === 'function') {
        socket.off('whiteboardAction', handleWhiteboardAction);
        socket.off('whiteboardUpdated', handleWhiteboardUpdated);
      }
    };
  }, [
    socket,
    roomName,
    islevel,
    parameters,
    whiteboardStarted,
    useImageBackground,
    recordStarted,
    recordStopped,
    recordPaused,
    recordResumed,
    recordingMediaOptions,
    onScreenChanges,
    captureCanvasStream,
  ]);

  const projectPoint = (point: { x: number; y: number }) => ({
    x: point.x * boardRenderScale + panOffset.x + boardBaseOffset.x,
    y: point.y * boardRenderScale + panOffset.y + boardBaseOffset.y,
  });

  const screenToBoardPoint = (pointX: number, pointY: number) => ({
    x: (pointX - panOffset.x - boardBaseOffset.x) / boardRenderScale,
    y: (pointY - panOffset.y - boardBaseOffset.y) / boardRenderScale,
  });

  const clampValue = (value: number, min: number, max: number) => {
    if (!Number.isFinite(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  };

  const hasBoardBounds = boardSize.width > 1 && boardSize.height > 1;

  const isPointWithinBoard = (point: { x: number; y: number }) => {
    if (!hasBoardBounds) {
      return true;
    }

    return (
      point.x >= 0
      && point.x <= boardSize.width
      && point.y >= 0
      && point.y <= boardSize.height
    );
  };

  const clampBoardPoint = (point: { x: number; y: number }) => {
    if (!hasBoardBounds) {
      return point;
    }

    return {
      x: clampValue(point.x, 0, boardSize.width),
      y: clampValue(point.y, 0, boardSize.height),
    };
  };

  const getShapeBounds = (shape: any) => {
    if (!shape) {
      return null;
    }

    if (shape.type === 'freehand' && Array.isArray(shape.points) && shape.points.length) {
      const xValues = shape.points.map((point: any) => point?.x || 0);
      const yValues = shape.points.map((point: any) => point?.y || 0);
      return {
        left: Math.min(...xValues),
        top: Math.min(...yValues),
        width: Math.max(...xValues) - Math.min(...xValues),
        height: Math.max(...yValues) - Math.min(...yValues),
      };
    }

    if (shape.type === 'text') {
      const textMetrics = getTextMetrics(shape);
      return {
        left: shape.x || 0,
        top: shape.y || 0,
        width: textMetrics.width,
        height: textMetrics.height,
      };
    }

    const x1 = shape.x1 || 0;
    const y1 = shape.y1 || 0;
    const x2 = shape.x2 ?? x1;
    const y2 = shape.y2 ?? y1;

    if (shape.type === 'square') {
      const sideDelta = x2 - x1;
      return {
        left: Math.min(x1, x1 + sideDelta),
        top: Math.min(y1, y1 + sideDelta),
        width: Math.abs(sideDelta),
        height: Math.abs(sideDelta),
      };
    }

    if (shape.type === 'circle') {
      const radius = Math.hypot(x2 - x1, y2 - y1);
      return {
        left: x1 - radius,
        top: y1 - radius,
        width: radius * 2,
        height: radius * 2,
      };
    }

    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    return {
      left,
      top,
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    };
  };

  const translateShape = (shape: any, deltaX: number, deltaY: number) => {
    if (!shape) {
      return shape;
    }

    if (shape.type === 'freehand' && Array.isArray(shape.points)) {
      return {
        ...shape,
        points: shape.points.map((point: any) => ({
          ...point,
          x: (point?.x || 0) + deltaX,
          y: (point?.y || 0) + deltaY,
        })),
      };
    }

    if (shape.type === 'text') {
      return { ...shape, x: (shape.x || 0) + deltaX, y: (shape.y || 0) + deltaY };
    }

    return {
      ...shape,
      x1: (shape.x1 || 0) + deltaX,
      y1: (shape.y1 || 0) + deltaY,
      x2: (shape.x2 ?? shape.x1 ?? 0) + deltaX,
      y2: (shape.y2 ?? shape.y1 ?? 0) + deltaY,
    };
  };

  const fitShapeWithinBoard = (shape: any) => {
    if (!shape || !hasBoardBounds) {
      return shape;
    }

    let normalizedShape = shape;

    if (shape.type === 'freehand' && Array.isArray(shape.points)) {
      normalizedShape = {
        ...shape,
        points: shape.points.map((point: any) => clampBoardPoint({
          x: point?.x || 0,
          y: point?.y || 0,
        })),
      };
    } else if (shape.type === 'text') {
      normalizedShape = {
        ...shape,
        text: getTextContent(shape.text),
        x: clampValue(shape.x || 0, 0, boardSize.width),
        y: clampValue(shape.y || 0, 0, boardSize.height),
      };
    } else if (shape.type === 'image' || shape.x1 !== undefined || shape.y1 !== undefined) {
      normalizedShape = {
        ...shape,
        x1: clampValue(shape.x1 || 0, 0, boardSize.width),
        y1: clampValue(shape.y1 || 0, 0, boardSize.height),
        x2: clampValue(shape.x2 ?? shape.x1 ?? 0, 0, boardSize.width),
        y2: clampValue(shape.y2 ?? shape.y1 ?? 0, 0, boardSize.height),
      };
    }

    const bounds = getShapeBounds(normalizedShape);
    if (!bounds) {
      return normalizedShape;
    }

    const maxLeft = Math.max(0, boardSize.width - bounds.width);
    const maxTop = Math.max(0, boardSize.height - bounds.height);
    const deltaX = clampValue(bounds.left, 0, maxLeft) - bounds.left;
    const deltaY = clampValue(bounds.top, 0, maxTop) - bounds.top;

    if (deltaX === 0 && deltaY === 0) {
      return normalizedShape;
    }

    return translateShape(normalizedShape, deltaX, deltaY);
  };

  const distanceToLine = (point: { x: number; y: number }, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const lineLengthSquared = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
    if (lineLengthSquared === 0) {
      return Math.hypot(point.x - start.x, point.y - start.y);
    }
    const rawPosition = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lineLengthSquared;
    const position = Math.max(0, Math.min(1, rawPosition));
    const projectedX = start.x + position * (end.x - start.x);
    const projectedY = start.y + position * (end.y - start.y);
    return Math.hypot(point.x - projectedX, point.y - projectedY);
  };

  const isPointInsideShape = (shape: any, point: { x: number; y: number }, tolerance = 16) => {
    if (!shape) {
      return false;
    }

    if (shape.type === 'line') {
      return distanceToLine(point, { x: shape.x1 || 0, y: shape.y1 || 0 }, { x: shape.x2 || 0, y: shape.y2 || 0 }) <= tolerance;
    }

    if (shape.type === 'circle') {
      const centerX = shape.x1 || 0;
      const centerY = shape.y1 || 0;
      const radius = Math.hypot((shape.x2 ?? centerX) - centerX, (shape.y2 ?? centerY) - centerY);
      return Math.hypot(point.x - centerX, point.y - centerY) <= radius + tolerance;
    }

    if (shape.type === 'freehand' && Array.isArray(shape.points)) {
      return shape.points.some((shapePoint: any, index: number) => {
        if (index === 0) {
          return false;
        }
        const previous = shape.points[index - 1];
        return distanceToLine(
          point,
          { x: previous?.x || 0, y: previous?.y || 0 },
          { x: shapePoint?.x || 0, y: shapePoint?.y || 0 },
        ) <= tolerance;
      });
    }

    const bounds = getShapeBounds(shape);
    if (!bounds) {
      return false;
    }

    return (
      point.x >= bounds.left - tolerance &&
      point.x <= bounds.left + bounds.width + tolerance &&
      point.y >= bounds.top - tolerance &&
      point.y <= bounds.top + bounds.height + tolerance
    );
  };

  const findShapeIndexAtPoint = (point: { x: number; y: number }) => {
    for (let shapeIndex = localShapes.length - 1; shapeIndex >= 0; shapeIndex -= 1) {
      if (isPointInsideShape(localShapes[shapeIndex], point)) {
        return shapeIndex;
      }
    }
    return null;
  };

  const lineStyle = (x1: number, y1: number, x2: number, y2: number, color = '#0ea5e9', thickness = 3) => {
    const start = projectPoint({ x: x1, y: y1 });
    const end = projectPoint({ x: x2, y: y2 });
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const scaledThickness = Math.max(1, thickness * boardRenderScale);

    return {
      position: 'absolute' as const,
      left: start.x,
      top: start.y,
      width: length,
      height: scaledThickness,
      backgroundColor: color,
      borderRadius: scaledThickness / 2,
      transform: [{ rotateZ: `${angle}rad` }],
      transformOrigin: 'left center' as any,
    };
  };

  const getLinePattern = (style: WhiteboardLineType, thickness: number) => {
    if (style === 'dashed') {
      return [Math.max(12, thickness * 2.5), Math.max(8, thickness * 1.8)];
    }
    if (style === 'dotted') {
      return [Math.max(2, thickness), Math.max(8, thickness * 2)];
    }
    if (style === 'dashDot') {
      return [Math.max(12, thickness * 2.5), Math.max(6, thickness), Math.max(2, thickness), Math.max(6, thickness)];
    }
    return [];
  };

  const renderLineSegments = (
    keyPrefix: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = '#0ea5e9',
    thickness = 3,
    style: WhiteboardLineType = 'solid',
  ) => {
    const lineLength = Math.hypot(x2 - x1, y2 - y1);
    const pattern = getLinePattern(style, thickness);
    if (style === 'solid' || pattern.length === 0 || lineLength <= 1) {
      return <View key={keyPrefix} style={lineStyle(x1, y1, x2, y2, color, thickness)} />;
    }

    const segments: JSX.Element[] = [];
    let distance = 0;
    let patternIndex = 0;
    while (distance < lineLength) {
      const dashLength = Math.min(pattern[patternIndex % pattern.length], lineLength - distance);
      if (patternIndex % 2 === 0 && dashLength > 0) {
        const startRatio = distance / lineLength;
        const endRatio = (distance + dashLength) / lineLength;
        const segmentStartX = x1 + (x2 - x1) * startRatio;
        const segmentStartY = y1 + (y2 - y1) * startRatio;
        const segmentEndX = x1 + (x2 - x1) * endRatio;
        const segmentEndY = y1 + (y2 - y1) * endRatio;
        segments.push(
          <View
            key={`${keyPrefix}-${patternIndex}`}
            style={lineStyle(segmentStartX, segmentStartY, segmentEndX, segmentEndY, color, thickness)}
          />,
        );
      }
      distance += dashLength;
      patternIndex += 1;
    }
    return segments;
  };

  const getPolygonVertices = (shape: any) => {
    const x1 = shape.x1 || 0;
    const y1 = shape.y1 || 0;
    const x2 = shape.x2 ?? x1;
    const y2 = shape.y2 ?? y1;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const right = left + width;
    const bottom = top + height;

    if (shape.type === 'triangle') {
      return [{ x: centerX, y: top }, { x: right, y: bottom }, { x: left, y: bottom }];
    }
    if (shape.type === 'rhombus') {
      return [{ x: centerX, y: top }, { x: right, y: centerY }, { x: centerX, y: bottom }, { x: left, y: centerY }];
    }
    if (shape.type === 'parallelogram') {
      return [{ x: centerX, y: y1 }, { x: x2, y: y2 }, { x: centerX, y: y2 }, { x: x1, y: y1 }];
    }

    const sides = shape.type === 'pentagon' ? 5 : shape.type === 'hexagon' ? 6 : shape.type === 'octagon' ? 8 : 4;
    const radius = Math.min(width, height) / 2;
    return Array.from({ length: sides }).map((_unused, vertexIndex) => {
      const angle = (2 * Math.PI * vertexIndex) / sides - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  };

  const renderSelectionBounds = (shape: any, index: number) => {
    if (selectedShapeIndex !== index) {
      return null;
    }
    const bounds = getShapeBounds(shape);
    if (!bounds) {
      return null;
    }
    const topLeft = projectPoint({ x: bounds.left, y: bounds.top });
    return (
      <View
        key={`selection-${index}`}
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: topLeft.x - 6,
          top: topLeft.y - 6,
          width: Math.max(12, bounds.width * boardRenderScale + 12),
          height: Math.max(12, bounds.height * boardRenderScale + 12),
          borderWidth: 2,
          borderColor: '#38bdf8',
          borderStyle: 'dashed',
          borderRadius: 8,
        }}
      />
    );
  };

  const renderShape = (shape: any, index: number, isDraft = false) => {
    if (!shape) {
      return null;
    }

    if (shape.type === 'freehand' && Array.isArray(shape.points)) {
      const points = shape.points as Array<{ x: number; y: number }>;
      return (
        <React.Fragment key={`fh-${index}`}>
          {points.slice(1).map((point, idx) => renderLineSegments(
            `fh-${index}-${idx}`,
            points[idx]?.x || 0,
            points[idx]?.y || 0,
            point?.x || 0,
            point?.y || 0,
            shape.color,
            shape.thickness,
          ))}
          {!isDraft && renderSelectionBounds(shape, index)}
        </React.Fragment>
      );
    }

    if (shape.type === 'line') {
      return (
        <React.Fragment key={`ln-${index}`}>
          {renderLineSegments(`ln-${index}`, shape.x1 || 0, shape.y1 || 0, shape.x2 || 0, shape.y2 || 0, shape.color, shape.thickness, shape.lineType || 'solid')}
          {!isDraft && renderSelectionBounds(shape, index)}
        </React.Fragment>
      );
    }

    if (shape.type === 'rectangle' || shape.type === 'square' || shape.type === 'circle' || shape.type === 'oval') {
      const bounds = getShapeBounds(shape) || { left: 0, top: 0, width: 0, height: 0 };
      const topLeft = projectPoint({ x: bounds.left, y: bounds.top });
      const projectedWidth = bounds.width * boardRenderScale;
      const projectedHeight = bounds.height * boardRenderScale;
      return (
        <React.Fragment key={`shape-${index}`}>
          <View
            style={{
              position: 'absolute',
              left: topLeft.x,
              top: topLeft.y,
              width: projectedWidth,
              height: projectedHeight,
              borderColor: shape.color || '#0ea5e9',
              borderWidth: Math.max(1, (shape.thickness || 2) * boardRenderScale),
              borderRadius: shape.type === 'circle' || shape.type === 'oval' ? 999 : 0,
            }}
          />
          {!isDraft && renderSelectionBounds(shape, index)}
        </React.Fragment>
      );
    }

    if (['triangle', 'rhombus', 'pentagon', 'hexagon', 'octagon', 'parallelogram'].includes(shape.type)) {
      const vertices = getPolygonVertices(shape);
      return (
        <React.Fragment key={`poly-${index}`}>
          {vertices.map((vertex, vertexIndex) => {
            const nextVertex = vertices[(vertexIndex + 1) % vertices.length];
            return renderLineSegments(
              `poly-${index}-${vertexIndex}`,
              vertex.x,
              vertex.y,
              nextVertex.x,
              nextVertex.y,
              shape.color,
              shape.thickness,
              shape.lineType || 'solid',
            );
          })}
          {!isDraft && renderSelectionBounds(shape, index)}
        </React.Fragment>
      );
    }

    if (shape.type === 'text') {
      const point = projectPoint({ x: shape.x || 20, y: shape.y || 20 });
      const textValue = getTextContent(shape.text);
      return (
        <React.Fragment key={`txt-${index}`}>
          <Text
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              color: shape.color || '#0f172a',
              fontSize: Math.max(8, (shape.fontSize || 16) * boardRenderScale),
              fontFamily: shape.font || undefined,
              fontWeight: '600',
            }}
          >
            {textValue}
          </Text>
          {!isDraft && renderSelectionBounds(shape, index)}
        </React.Fragment>
      );
    }

    if (shape.type === 'image') {
      const bounds = getShapeBounds(shape) || { left: 0, top: 0, width: 1, height: 1 };
      const topLeft = projectPoint({ x: bounds.left, y: bounds.top });
      return (
        <React.Fragment key={`img-${index}`}>
          <Image
            source={{ uri: shape.src }}
            style={{
              position: 'absolute',
              left: topLeft.x,
              top: topLeft.y,
              width: Math.max(1, bounds.width * boardRenderScale),
              height: Math.max(1, bounds.height * boardRenderScale),
              resizeMode: 'contain',
            }}
          />
          {!isDraft && renderSelectionBounds(shape, index)}
        </React.Fragment>
      );
    }

    return null;
  };

  const renderGridLines = () => {
    if (!useImageBackground) {
      return null;
    }
    const spacing = 24;
    const lineColor = isDarkMode ? 'rgba(148,163,184,0.18)' : 'rgba(59,130,246,0.18)';
    const verticalLines = Math.ceil(boardSize.width / spacing) + 2;
    const horizontalLines = Math.ceil(boardSize.height / spacing) + 2;
    const frameLeft = panOffset.x + boardBaseOffset.x;
    const frameTop = panOffset.y + boardBaseOffset.y;
    return (
      <>
        {Array.from({ length: verticalLines }).map((_unused, lineIndex) => (
          <View
            key={`grid-v-${lineIndex}`}
            style={{
              position: 'absolute',
              left: frameLeft + lineIndex * spacing * boardRenderScale,
              top: frameTop,
              width: 1,
              height: boardSize.height * boardRenderScale,
              backgroundColor: lineColor,
            }}
          />
        ))}
        {Array.from({ length: horizontalLines }).map((_unused, lineIndex) => (
          <View
            key={`grid-h-${lineIndex}`}
            style={{
              position: 'absolute',
              left: frameLeft,
              top: frameTop + lineIndex * spacing * boardRenderScale,
              width: boardSize.width * boardRenderScale,
              height: 1,
              backgroundColor: lineColor,
            }}
          />
        ))}
      </>
    );
  };

  const renderBoardBounds = () => {
    if (!hasBoardBounds) {
      return null;
    }

    const frameLeft = panOffset.x + boardBaseOffset.x;
    const frameTop = panOffset.y + boardBaseOffset.y;
    const frameWidth = Math.max(1, boardSize.width * boardRenderScale);
    const frameHeight = Math.max(1, boardSize.height * boardRenderScale);
    const cornerColor = '#ef4444';
    const frameColor = isDarkMode ? 'rgba(226, 232, 240, 0.45)' : 'rgba(37, 99, 235, 0.35)';
    const cornerSize = 18;
    const cornerThickness = 3;

    return (
      <>
        <View
          pointerEvents="none"
          style={[
            styles.boardBoundsFrame,
            {
              left: frameLeft,
              top: frameTop,
              width: frameWidth,
              height: frameHeight,
              borderColor: frameColor,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft,
            top: frameTop,
            width: cornerSize,
            height: cornerThickness,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft,
            top: frameTop,
            width: cornerThickness,
            height: cornerSize,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft + frameWidth - cornerSize,
            top: frameTop,
            width: cornerSize,
            height: cornerThickness,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft + frameWidth - cornerThickness,
            top: frameTop,
            width: cornerThickness,
            height: cornerSize,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft,
            top: frameTop + frameHeight - cornerThickness,
            width: cornerSize,
            height: cornerThickness,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft,
            top: frameTop + frameHeight - cornerSize,
            width: cornerThickness,
            height: cornerSize,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft + frameWidth - cornerSize,
            top: frameTop + frameHeight - cornerThickness,
            width: cornerSize,
            height: cornerThickness,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft + frameWidth - cornerThickness,
            top: frameTop + frameHeight - cornerSize,
            width: cornerThickness,
            height: cornerSize,
            borderRadius: cornerThickness,
            backgroundColor: cornerColor,
          }}
        />
      </>
    );
  };

  const emitBoardAction = (action: string, payload?: any) => {
    socket?.emit?.('updateBoardAction', payload === undefined ? { action } : { action, payload }, handleServerResponse);
  };

  const beginDraw = (x: number, y: number) => {
    setExpandedPanel(null);

    if (tool === 'pan') {
      startPointRef.current = { x, y };
      dragPointRef.current = { x, y };
      return;
    }

    const rawBoardPoint = screenToBoardPoint(x, y);
    if (!isPointWithinBoard(rawBoardPoint)) {
      setSelectedShapeIndex(null);
      setActionStatus('Tap inside the highlighted board area.');
      return;
    }

    const boardPoint = clampBoardPoint(rawBoardPoint);
    startPointRef.current = boardPoint;
    dragPointRef.current = boardPoint;

    if (tool === 'text') {
      const targetIndex = findShapeIndexAtPoint(boardPoint);
      const existingShape = targetIndex !== null ? localShapes[targetIndex] : null;

      if (existingShape?.type === 'text') {
        setEditingTextIndex(targetIndex);
        setTextDraftPoint({ x: existingShape.x || boardPoint.x, y: existingShape.y || boardPoint.y });
        setTextDraftValue(getTextContent(existingShape.text));
        setSelectedShapeIndex(targetIndex);
        setActionStatus('Edit text');
      } else {
        setEditingTextIndex(null);
        setTextDraftPoint(boardPoint);
        setTextDraftValue('');
        setSelectedShapeIndex(null);
        setActionStatus('Enter text');
      }

      setIsTextEditorVisible(true);
      startPointRef.current = null;
      dragPointRef.current = null;
      return;
    }

    if (tool === 'select') {
      setSelectedShapeIndex(findShapeIndexAtPoint(boardPoint));
      return;
    }

    if (tool === 'draw' || tool === 'shape') {
      setDraftPoints([boardPoint, boardPoint]);
    } else if (tool === 'freehand') {
      setDraftPoints([boardPoint]);
    } else if (tool === 'erase') {
      applyBoardAction('erase', { x: boardPoint.x, y: boardPoint.y, size: eraserThickness });
    }
  };

  const moveDraw = (x: number, y: number) => {
    if (!startPointRef.current) {
      return;
    }

    if (tool === 'pan') {
      const previousPoint = dragPointRef.current || { x, y };
      setPanOffset((previousOffset) => ({
        x: previousOffset.x + (x - previousPoint.x),
        y: previousOffset.y + (y - previousPoint.y),
      }));
      dragPointRef.current = { x, y };
      return;
    }

    const boardPoint = clampBoardPoint(screenToBoardPoint(x, y));

    if (tool === 'select') {
      if (selectedShapeIndex === null || !dragPointRef.current) {
        return;
      }
      const deltaX = boardPoint.x - dragPointRef.current.x;
      const deltaY = boardPoint.y - dragPointRef.current.y;
      setLocalShapes((previousShapes) => {
        const nextShapes = previousShapes.map((shape, index) => (
          index === selectedShapeIndex ? fitShapeWithinBoard(translateShape(shape, deltaX, deltaY)) : shape
        ));
        updateShapes?.(nextShapes);
        return nextShapes;
      });
      dragPointRef.current = boardPoint;
      return;
    }

    if (tool === 'erase') {
      applyBoardAction('erase', { x: boardPoint.x, y: boardPoint.y, size: eraserThickness });
      return;
    }

    if (tool === 'freehand') {
      setDraftPoints((prev) => [...prev, boardPoint]);
    } else if (tool === 'draw' || tool === 'shape') {
      setDraftPoints((prev) => [prev[0], boardPoint]);
    }
  };

  const commitDraw = () => {
    const origin = startPointRef.current;
    if (!origin) {
      return;
    }

    if (tool === 'select') {
      emitBoardAction('shapes', { shapes: localShapes });
      setDraftPoints([]);
      startPointRef.current = null;
      dragPointRef.current = null;
      return;
    }

    if (tool === 'pan') {
      startPointRef.current = null;
      dragPointRef.current = null;
      return;
    }

    if (tool === 'draw' && draftPoints.length > 1) {
      const payload = {
        type: 'line',
        x1: draftPoints[0].x,
        y1: draftPoints[0].y,
        x2: draftPoints[1].x,
        y2: draftPoints[1].y,
        color: penColor,
        thickness: lineThickness,
        lineType,
      };
      applyBoardAction('draw', payload);
      emitBoardAction('draw', payload);
    }

    if (tool === 'freehand' && draftPoints.length > 1) {
      const payload = {
        type: 'freehand',
        points: draftPoints,
        color: penColor,
        thickness: brushThickness,
      };
      applyBoardAction('draw', payload);
      emitBoardAction('draw', payload);
    }

    if (tool === 'shape' && draftPoints.length > 1) {
      const payload = {
        type: shapeType,
        x1: draftPoints[0].x,
        y1: draftPoints[0].y,
        x2: draftPoints[1].x,
        y2: draftPoints[1].y,
        color: penColor,
        thickness: lineThickness,
        lineType,
      };
      applyBoardAction('shape', payload);
      emitBoardAction('shape', payload);
    }

    if (tool === 'erase') {
      const payload = {
        x: origin.x,
        y: origin.y,
        size: eraserThickness,
      };
      emitBoardAction('erase', payload);
    }

    setDraftPoints([]);
    startPointRef.current = null;
    dragPointRef.current = null;
  };

  const adjustZoom = (nextScale: number) => {
    const clampedScale = Math.min(Math.max(nextScale, 0.6), 4);
    if (surfaceSize.width <= 1 || surfaceSize.height <= 1) {
      setZoomScale(clampedScale);
      setActionStatus(`Zoom ${Math.round(clampedScale * 100)}%`);
      return;
    }

    const centerX = surfaceSize.width / 2;
    const centerY = surfaceSize.height / 2;
    const boardCenter = screenToBoardPoint(centerX, centerY);
    const nextBoardRenderScale = Math.max(fitScale * clampedScale, 0.01);
    const nextBoardBaseOffset = {
      x: Math.max(0, (surfaceSize.width - boardSize.width * nextBoardRenderScale) / 2),
      y: Math.max(0, (surfaceSize.height - boardSize.height * nextBoardRenderScale) / 2),
    };

    setZoomScale(clampedScale);
    setPanOffset({
      x: centerX - nextBoardBaseOffset.x - boardCenter.x * nextBoardRenderScale,
      y: centerY - nextBoardBaseOffset.y - boardCenter.y * nextBoardRenderScale,
    });
    setActionStatus(`Zoom ${Math.round(clampedScale * 100)}%`);
  };

  const zoomBoard = (mode: 'in' | 'out' | 'reset') => {
    if (mode === 'reset') {
      setZoomScale(1);
      setPanOffset({ x: 0, y: 0 });
      setActionStatus('Zoom reset');
      return;
    }

    adjustZoom(zoomScale * (mode === 'in' ? 1.2 : 0.8));
  };

  const closeTextEditor = () => {
    setIsTextEditorVisible(false);
    setTextDraftValue('');
    setTextDraftPoint(null);
    setEditingTextIndex(null);
  };

  const saveTextEntry = () => {
    const nextText = getTextContent(textDraftValue).trim();
    if (!nextText) {
      notify('Enter text before saving.', 'warning');
      return;
    }

    if (!textDraftPoint) {
      closeTextEditor();
      return;
    }

    const existingTextShape = editingTextIndex !== null ? localShapes[editingTextIndex] : null;
    const payload = fitShapeWithinBoard({
      type: 'text',
      text: nextText,
      x: textDraftPoint.x,
      y: textDraftPoint.y,
      color: existingTextShape?.type === 'text' ? existingTextShape.color : penColor,
      font: existingTextShape?.type === 'text' ? existingTextShape.font : fontFamily,
      fontSize: existingTextShape?.type === 'text' ? existingTextShape.fontSize : fontSize,
    });

    if (!payload) {
      closeTextEditor();
      return;
    }

    if (editingTextIndex !== null && existingTextShape?.type === 'text') {
      const nextShapes = localShapes.map((shape: any, index: number) => (
        index === editingTextIndex ? payload : shape
      ));
      applyBoardAction('shapes', { shapes: nextShapes });
      emitBoardAction('shapes', { shapes: nextShapes });
      setSelectedShapeIndex(editingTextIndex);
      setActionStatus('Updated text');
    } else {
      applyBoardAction('text', payload);
      emitBoardAction('text', payload);
      setActionStatus('Added text');
    }

    closeTextEditor();
  };

  const deleteSelectedShape = () => {
    if (!canEdit) {
      notify('You are not allowed to delete board items.', 'danger');
      return;
    }

    if (selectedShapeIndex === null) {
      notify('Select an item to delete first.', 'warning');
      return;
    }

    const payload = { index: selectedShapeIndex };
    applyBoardAction('deleteShape', payload);
    emitBoardAction('deleteShape', payload);
    setSelectedShapeIndex(null);
    setActionStatus('Deleted selected item');
  };

  const toggleToolbarVisibility = () => {
    setToolbarVisible((previous) => {
      const next = !previous;
      if (!next) {
        setExpandedPanel(null);
        setIsColorPickerVisible(false);
      }
      setActionStatus(next ? 'Toolbar expanded' : 'Toolbar collapsed');
      return next;
    });
  };

  const saveBoardSnapshot = async () => {
    const snapshot = {
      whiteboardData: {
        shapes: localShapes,
        redoStack: localRedo,
        undoStack: localUndo,
        useImageBackground,
      },
      view: {
        zoomScale,
        panOffset,
      },
    };
    try {
      await Share.share({
        title: 'Whiteboard snapshot',
        message: JSON.stringify(snapshot, null, 2),
      });
      setActionStatus('Prepared board snapshot');
    } catch {
      notify('Unable to prepare board snapshot.', 'danger');
    }
  };

  const uploadImageFromUrl = () => {
    const src = imageUrl.trim();
    if (!canEdit) {
      notify('You are not allowed to upload images.', 'danger');
      return;
    }
    if (!src || (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:image/'))) {
      notify('Enter a valid image URL (http/https or data:image).', 'warning');
      return;
    }

    const imageWidth = Math.min(Math.max(boardSize.width * 0.35, 120), boardSize.width - 20);
    const imageHeight = Math.min(Math.max(boardSize.height * 0.3, 100), boardSize.height - 20);
    const payload = {
      type: 'image',
      src,
      x1: 10,
      y1: 10,
      x2: 10 + imageWidth,
      y2: 10 + imageHeight,
    };

    applyBoardAction('uploadImage', payload);
    socket?.emit?.('updateBoardAction', { action: 'uploadImage', payload }, handleServerResponse);
    setImageUrl('');
    setExpandedPanel(null);
    setActionStatus('Uploaded image to board');
  };

  const uploadImageFromDevice = async () => {
    if (!canEdit) {
      notify('You are not allowed to upload images.', 'danger');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: true,
        quality: 0.6,
        maxWidth: 1280,
        maxHeight: 1280,
      });

      if (result.didCancel || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      const maxBytes = 1024 * 1024;
      const base64Data = asset.base64 || '';
      if (!base64Data) {
        notify('Unable to process selected image.', 'danger');
        return;
      }

      const estimatedBytes = Math.ceil(base64Data.length * 0.75);
      if (estimatedBytes > maxBytes) {
        notify('Compressed image is still above 1MB. Please choose a smaller image.', 'danger');
        return;
      }

      const mimeType = asset.type || 'image/jpeg';
      const src = `data:${mimeType};base64,${base64Data}`;

      const imageWidth = Math.min(Math.max(boardSize.width * 0.35, 120), boardSize.width - 20);
      const imageHeight = Math.min(Math.max(boardSize.height * 0.3, 100), boardSize.height - 20);
      const payload = {
        type: 'image',
        src,
        x1: 10,
        y1: 10,
        x2: 10 + imageWidth,
        y2: 10 + imageHeight,
      };

      applyBoardAction('uploadImage', payload);
      socket?.emit?.('updateBoardAction', { action: 'uploadImage', payload }, handleServerResponse);
      setExpandedPanel(null);
      setActionStatus('Uploaded image from device');
    } catch {
      notify('Image selection failed.', 'danger');
    }
  };

  useEffect(() => {
    setLocalShapes(Array.isArray(shapes) ? shapes.map((shape: any) => fitShapeWithinBoard(shape)).filter(Boolean) : []);
  }, [fitScale, shapes]);

  useEffect(() => {
    setLocalRedo(Array.isArray(redoStack) ? redoStack : []);
  }, [redoStack]);

  useEffect(() => {
    setLocalUndo(Array.isArray(undoStack) ? undoStack : []);
  }, [undoStack]);

  useEffect(() => {
    if (selectedShapeIndex !== null && (selectedShapeIndex < 0 || selectedShapeIndex >= localShapes.length)) {
      setSelectedShapeIndex(null);
    }
  }, [localShapes, selectedShapeIndex]);

  if (!visible) {
    return null;
  }

  const sessionActive = whiteboardStarted && !whiteboardEnded;
  const selectedShape = selectedShapeIndex !== null ? localShapes[selectedShapeIndex] : null;
  const zoomPercent = Math.round(zoomScale * 100);
  const compactToolbarPickerConfigs: any[] = [];

  if (tool === 'shape') {
    compactToolbarPickerConfigs.push({
      key: 'shapeType',
      value: shapeType,
      width: 112,
      items: shapeOptions.map((item) => ({ label: item.label, value: item.key })),
      onChange: (value: WhiteboardShapeType) => {
        setShapeType(value);
        setTool('shape');
      },
    });
  }

  if (tool === 'draw' || tool === 'shape') {
    compactToolbarPickerConfigs.push(
      {
        key: 'lineThickness',
        value: lineThickness,
        width: 108,
        items: LINE_THICKNESS_OPTIONS.map((value) => ({ label: `Line ${value}px`, value })),
        onChange: (value: number) => setLineThickness(value),
      },
      {
        key: 'lineType',
        value: lineType,
        width: 96,
        items: LINE_TYPE_OPTIONS.map((option) => ({ label: option.label, value: option.value })),
        onChange: (value: WhiteboardLineType) => setLineType(value),
      },
    );
  }

  if (tool === 'freehand') {
    compactToolbarPickerConfigs.push({
      key: 'brushThickness',
      value: brushThickness,
      width: 112,
      items: BRUSH_THICKNESS_OPTIONS.map((value) => ({ label: `Brush ${value}px`, value })),
      onChange: (value: number) => setBrushThickness(value),
    });
  }

  if (tool === 'erase') {
    compactToolbarPickerConfigs.push({
      key: 'eraserThickness',
      value: eraserThickness,
      width: 116,
      items: ERASER_THICKNESS_OPTIONS.map((value) => ({ label: `Erase ${value}px`, value })),
      onChange: (value: number) => setEraserThickness(value),
    });
  }

  if (tool === 'text') {
    compactToolbarPickerConfigs.push(
      {
        key: 'fontFamily',
        value: fontFamily,
        width: 112,
        items: FONT_FAMILY_OPTIONS,
        onChange: (value: string) => setFontFamily(value),
      },
      {
        key: 'fontSize',
        value: fontSize,
        width: 92,
        items: FONT_SIZE_OPTIONS.map((value) => ({ label: `${value}px`, value })),
        onChange: (value: number) => setFontSize(value),
      },
    );
  }

  const renderCompactPicker = (config: any) => (
    <View key={config.key} style={[styles.inlinePickerWrap, { width: config.width }]}>
      <RNPickerSelect
        onValueChange={(value) => {
          if (value !== null && value !== undefined) {
            config.onChange(value);
          }
        }}
        items={config.items}
        value={config.value}
        style={compactPickerTheme}
        placeholder={{}}
        useNativeAndroidPickerStyle={false}
        Icon={isDarkMode ? DarkPickerChevronIcon : LightPickerChevronIcon}
      />
    </View>
  );

  const content = (
    <View style={[useInlineLayout ? styles.inlineWrapper : styles.overlay, { backgroundColor: useInlineLayout ? (isDarkMode ? 'rgba(15,23,42,0.1)' : 'rgba(248,250,252,0.82)') : 'rgba(0,0,0,0.45)' }]}>
      <View
        style={[
          styles.container,
          useInlineLayout && styles.inlineContainer,
          { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', borderColor: theme.borderColor },
        ]}
      >
        {!compactInlineToolbar && (
          <View style={[styles.header, { borderBottomColor: theme.dividerColor }]}>
            <View style={styles.headerTitleGroup}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: isDarkMode ? 'rgba(56,189,248,0.14)' : 'rgba(37,99,235,0.12)' },
                ]}
              >
                <FontAwesome5 name="chalkboard" size={16} color={theme.accentColor} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: theme.textColor }]} numberOfLines={1}>Whiteboard</Text>
                <Text style={[styles.subText, { color: theme.mutedTextColor }]} numberOfLines={1}>{actionStatus}</Text>
              </View>
            </View>
            <View style={styles.statusPills}>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: sessionActive ? 'rgba(34,197,94,0.14)' : theme.badgeBackgroundColor,
                    borderColor: sessionActive ? 'rgba(34,197,94,0.35)' : theme.borderColor,
                  },
                ]}
              >
                <Text style={[styles.statusPillText, { color: sessionActive ? theme.successColor : theme.badgeTextColor }]}>{sessionActive ? 'Active' : 'Inactive'}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: canEdit ? theme.badgeBackgroundColor : 'rgba(148,163,184,0.14)', borderColor: theme.borderColor },
                ]}
              >
                <Text style={[styles.statusPillText, { color: canEdit ? theme.badgeTextColor : theme.mutedTextColor }]}>{canEdit ? 'Edit' : 'View'}</Text>
              </View>
              <TouchableOpacity
                style={[styles.headerToggleButton, { backgroundColor: theme.rowBackgroundColor, borderColor: theme.borderColor }]}
                onPress={toggleToolbarVisibility}
              >
                <FontAwesome5 name={toolbarVisible ? 'chevron-up' : 'chevron-down'} size={11} color={theme.iconColor} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {toolbarVisible && (
          <View style={[styles.toolbarBlock, compactInlineToolbar && styles.inlineToolbarBlock, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.88)' : 'rgba(255, 255, 255, 0.96)', borderColor: theme.borderColor }]}>
            {compactInlineToolbar ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineToolbarRow}>
                {toolOptions.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.toolButton, styles.compactToolButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, tool === item.key && styles.toolButtonActive]}
                    onPress={() => handleToolPress(item.key)}
                  >
                    <FontAwesome5 name={item.icon} size={13} color={tool === item.key ? '#ffffff' : theme.iconColor} />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                  onPress={saveBoardSnapshot}
                >
                  <FontAwesome5 name="save" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                  disabled={!canEdit}
                  onPress={() => {
                    const payload = { shapes: localShapes };
                    socket?.emit?.('updateBoardAction', { action: 'shapes', payload }, handleServerResponse);
                    setActionStatus('Synced shapes snapshot');
                  }}
                >
                  <FontAwesome5 name="sync" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                  onPress={() => zoomBoard('in')}
                >
                  <FontAwesome5 name="search-plus" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarStatusButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                  onPress={() => zoomBoard('reset')}
                >
                  <Text style={[styles.toolbarStatusText, { color: theme.textColor }]}>{zoomPercent}%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                  onPress={() => zoomBoard('out')}
                >
                  <FontAwesome5 name="search-minus" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                  disabled={!canEdit}
                  onPress={() => {
                    applyBoardAction('undo', {});
                    socket?.emit?.('updateBoardAction', { action: 'undo' }, handleServerResponse);
                  }}
                >
                  <FontAwesome5 name="undo" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                  disabled={!canEdit}
                  onPress={() => {
                    applyBoardAction('redo', {});
                    socket?.emit?.('updateBoardAction', { action: 'redo' }, handleServerResponse);
                  }}
                >
                  <FontAwesome5 name="redo" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: expandedPanel === 'image' ? '#60a5fa' : theme.borderColor, backgroundColor: expandedPanel === 'image' ? '#2563eb' : theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                  disabled={!canEdit}
                  onPress={() => toggleExpandedPanel('image')}
                >
                  <FontAwesome5 name="image" size={13} color={expandedPanel === 'image' ? '#ffffff' : theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                  disabled={!canEdit}
                  onPress={() => {
                    applyBoardAction('toggleBackground', !useImageBackground);
                    socket?.emit?.('updateBoardAction', { action: 'toggleBackground', payload: !useImageBackground }, handleServerResponse);
                  }}
                >
                  <FontAwesome5 name="border-all" size={13} color={theme.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, styles.toolbarDangerButton, (!canEdit || !selectedShape) && styles.buttonDisabled]}
                  disabled={!canEdit || !selectedShape}
                  onPress={deleteSelectedShape}
                >
                  <FontAwesome5 name="trash-alt" size={13} color="#fecaca" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarIconButton, styles.toolbarDangerButton, !canEdit && styles.buttonDisabled]}
                  disabled={!canEdit}
                  onPress={() => {
                    applyBoardAction('clear', {});
                    socket?.emit?.('updateBoardAction', { action: 'clear' }, handleServerResponse);
                  }}
                >
                  <FontAwesome5 name="trash" size={13} color="#fecaca" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.colorTriggerButton, styles.colorTriggerButtonCompact, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                  onPress={() => {
                    setExpandedPanel(null);
                    setIsColorPickerVisible(true);
                  }}
                >
                  <View style={[styles.colorTriggerSwatch, { backgroundColor: penColor }]} />
                  <FontAwesome5 name="palette" size={12} color={theme.iconColor} />
                </TouchableOpacity>

                {compactToolbarPickerConfigs.map((config) => renderCompactPicker(config))}

                <TouchableOpacity
                  style={[styles.toolbarIconButton, styles.inlineToolbarToggleButton, { borderColor: '#60a5fa', backgroundColor: '#2563eb' }]}
                  onPress={toggleToolbarVisibility}
                >
                  <FontAwesome5 name="chevron-left" size={13} color="#ffffff" />
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolsRow}>
                  {toolOptions.map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.toolButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, tool === item.key && styles.toolButtonActive]}
                      onPress={() => handleToolPress(item.key)}
                    >
                      <FontAwesome5 name={item.icon} size={13} color={tool === item.key ? '#ffffff' : theme.iconColor} />
                      <Text style={[styles.toolText, { color: tool === item.key ? '#ffffff' : theme.textColor }]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarActionsRow}>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                    onPress={saveBoardSnapshot}
                  >
                    <FontAwesome5 name="save" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                    disabled={!canEdit}
                    onPress={() => {
                      const payload = { shapes: localShapes };
                      socket?.emit?.('updateBoardAction', { action: 'shapes', payload }, handleServerResponse);
                      setActionStatus('Synced shapes snapshot');
                    }}
                  >
                    <FontAwesome5 name="sync" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                    onPress={() => zoomBoard('in')}
                  >
                    <FontAwesome5 name="search-plus" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarStatusButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                    onPress={() => zoomBoard('reset')}
                  >
                    <Text style={[styles.toolbarStatusText, { color: theme.textColor }]}>{zoomPercent}%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                    onPress={() => zoomBoard('out')}
                  >
                    <FontAwesome5 name="search-minus" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                    disabled={!canEdit}
                    onPress={() => {
                      applyBoardAction('undo', {});
                      socket?.emit?.('updateBoardAction', { action: 'undo' }, handleServerResponse);
                    }}
                  >
                    <FontAwesome5 name="undo" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                    disabled={!canEdit}
                    onPress={() => {
                      applyBoardAction('redo', {});
                      socket?.emit?.('updateBoardAction', { action: 'redo' }, handleServerResponse);
                    }}
                  >
                    <FontAwesome5 name="redo" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: expandedPanel === 'image' ? '#60a5fa' : theme.borderColor, backgroundColor: expandedPanel === 'image' ? '#2563eb' : theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                    disabled={!canEdit}
                    onPress={() => toggleExpandedPanel('image')}
                  >
                    <FontAwesome5 name="image" size={13} color={expandedPanel === 'image' ? '#ffffff' : theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, !canEdit && styles.buttonDisabled]}
                    disabled={!canEdit}
                    onPress={() => {
                      applyBoardAction('toggleBackground', !useImageBackground);
                      socket?.emit?.('updateBoardAction', { action: 'toggleBackground', payload: !useImageBackground }, handleServerResponse);
                    }}
                  >
                    <FontAwesome5 name="border-all" size={13} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, styles.toolbarDangerButton, (!canEdit || !selectedShape) && styles.buttonDisabled]}
                    disabled={!canEdit || !selectedShape}
                    onPress={deleteSelectedShape}
                  >
                    <FontAwesome5 name="trash-alt" size={13} color="#fecaca" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toolbarIconButton, styles.toolbarDangerButton, !canEdit && styles.buttonDisabled]}
                    disabled={!canEdit}
                    onPress={() => {
                      applyBoardAction('clear', {});
                      socket?.emit?.('updateBoardAction', { action: 'clear' }, handleServerResponse);
                    }}
                  >
                    <FontAwesome5 name="trash" size={13} color="#fecaca" />
                  </TouchableOpacity>
                  {!useInlineLayout && (
                    <TouchableOpacity
                      style={[styles.toolbarIconButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                      onPress={() => {
                        updateIsWhiteboardModalVisible?.(false);
                        onWhiteboardClose?.();
                      }}
                    >
                      <FontAwesome5 name="times" size={13} color={theme.iconColor} />
                    </TouchableOpacity>
                  )}
                </ScrollView>

                <View style={styles.paletteRow}>
                  <TouchableOpacity
                    style={[styles.colorTriggerButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                    onPress={() => {
                      setExpandedPanel(null);
                      setIsColorPickerVisible(true);
                    }}
                  >
                    <View style={[styles.colorTriggerSwatch, { backgroundColor: penColor }]} />
                    <Text style={[styles.colorTriggerText, { color: theme.textColor }]} numberOfLines={1}>
                      {penColor.toUpperCase()}
                    </Text>
                    <FontAwesome5 name="palette" size={12} color={theme.iconColor} />
                  </TouchableOpacity>
                  <View style={styles.paletteMetaWrap}>
                    <Text style={[styles.metaPill, styles.metaPillText, { color: theme.mutedTextColor, borderColor: theme.borderColor }]}>{whiteboardUsers.length} with access</Text>
                    <Text style={[styles.metaPill, styles.metaPillText, { color: theme.textColor, borderColor: theme.borderColor }]}>{zoomPercent}% zoom</Text>
                    <Text style={[styles.metaPill, styles.metaPillText, { color: selectedShape ? theme.textColor : theme.mutedTextColor, borderColor: theme.borderColor }]}>
                      {selectedShape ? `${selectedShape.type || 'item'} selected` : 'No selection'}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {expandedPanel && (!compactInlineToolbar || expandedPanel === 'image') && (
              <View style={[styles.settingsPanel, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}>
                {expandedPanel === 'shape' && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Shape</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                      {shapeOptions.map((item) => (
                        <TouchableOpacity
                          key={item.key}
                          style={[styles.shapeButton, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, shapeType === item.key && styles.shapeButtonActive]}
                          onPress={() => {
                            setShapeType(item.key);
                            setTool('shape');
                            setExpandedPanel(null);
                          }}
                        >
                          <FontAwesome5 name={item.icon as any} size={12} color={shapeType === item.key ? '#ffffff' : theme.iconColor} />
                          <Text style={[styles.shapeText, { color: shapeType === item.key ? '#ffffff' : theme.textColor }]}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {(expandedPanel === 'draw' || expandedPanel === 'shape') && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Thickness</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                      {LINE_THICKNESS_OPTIONS.map((value) => (
                        <TouchableOpacity
                          key={`line-${value}`}
                          style={[styles.optionChip, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, lineThickness === value && styles.optionChipActive]}
                          onPress={() => {
                            setLineThickness(value);
                            setExpandedPanel(null);
                          }}
                        >
                          <Text style={[styles.optionChipText, { color: lineThickness === value ? '#ffffff' : theme.textColor }]}>{value}px</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {expandedPanel === 'freehand' && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Brush</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                      {BRUSH_THICKNESS_OPTIONS.map((value) => (
                        <TouchableOpacity
                          key={`brush-${value}`}
                          style={[styles.optionChip, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, brushThickness === value && styles.optionChipActive]}
                          onPress={() => {
                            setBrushThickness(value);
                            setExpandedPanel(null);
                          }}
                        >
                          <Text style={[styles.optionChipText, { color: brushThickness === value ? '#ffffff' : theme.textColor }]}>{value}px</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {expandedPanel === 'erase' && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Eraser</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                      {ERASER_THICKNESS_OPTIONS.map((value) => (
                        <TouchableOpacity
                          key={`eraser-${value}`}
                          style={[styles.optionChip, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, eraserThickness === value && styles.optionChipActive]}
                          onPress={() => {
                            setEraserThickness(value);
                            setExpandedPanel(null);
                          }}
                        >
                          <Text style={[styles.optionChipText, { color: eraserThickness === value ? '#ffffff' : theme.textColor }]}>{value}px</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {(expandedPanel === 'draw' || expandedPanel === 'shape') && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Line Style</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                      {LINE_TYPE_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[styles.optionChip, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, lineType === option.value && styles.optionChipActive]}
                          onPress={() => {
                            setLineType(option.value);
                            setExpandedPanel(null);
                          }}
                        >
                          <Text style={[styles.optionChipText, { color: lineType === option.value ? '#ffffff' : theme.textColor }]}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {expandedPanel === 'text' && (
                  <>
                    <View style={styles.settingRow}>
                      <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Font</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                        {FONT_FAMILY_OPTIONS.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[styles.optionChip, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, fontFamily === option.value && styles.optionChipActive]}
                            onPress={() => {
                              setFontFamily(option.value);
                              setExpandedPanel(null);
                            }}
                          >
                            <Text style={[styles.optionChipText, { color: fontFamily === option.value ? '#ffffff' : theme.textColor }]}>{option.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Size</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.settingRail}>
                        {FONT_SIZE_OPTIONS.map((value) => (
                          <TouchableOpacity
                            key={`font-${value}`}
                            style={[styles.optionChip, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }, fontSize === value && styles.optionChipActive]}
                            onPress={() => {
                              setFontSize(value);
                              setExpandedPanel(null);
                            }}
                          >
                            <Text style={[styles.optionChipText, { color: fontSize === value ? '#ffffff' : theme.textColor }]}>{value}px</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </>
                )}

                {expandedPanel === 'image' && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: theme.mutedTextColor }]}>Image</Text>
                    <View style={styles.uploadRow}>
                      <TextInput
                        style={[styles.urlInput, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor, color: theme.inputTextColor }]}
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        placeholder="Paste image URL"
                        placeholderTextColor={theme.placeholderTextColor}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={[styles.iconButton, !canEdit && styles.buttonDisabled]}
                        disabled={!canEdit}
                        onPress={uploadImageFromUrl}
                      >
                        <FontAwesome5 name="link" size={13} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconButton, !canEdit && styles.buttonDisabled]}
                        disabled={!canEdit}
                        onPress={uploadImageFromDevice}
                      >
                        <FontAwesome5 name="image" size={13} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {compactInlineToolbar && !toolbarVisible && (
          <TouchableOpacity
            style={[styles.inlineToolbarToggle, { borderColor: '#60a5fa', backgroundColor: '#2563eb' }]}
            onPress={toggleToolbarVisibility}
          >
            <FontAwesome5 name="chevron-left" size={13} color="#ffffff" />
          </TouchableOpacity>
        )}

        <View
          style={[styles.boardSurface, { borderColor: theme.borderColor, backgroundColor: useImageBackground ? '#f8fafc' : '#e2e8f0' }]}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            handleBoardLayout(width, height);
          }}
          onStartShouldSetResponder={() => canEdit}
          onMoveShouldSetResponder={() => canEdit}
          onResponderGrant={(event) => beginDraw(event.nativeEvent.locationX, event.nativeEvent.locationY)}
          onResponderMove={(event) => moveDraw(event.nativeEvent.locationX, event.nativeEvent.locationY)}
          onResponderRelease={commitDraw}
        >
          <View pointerEvents="none" style={[styles.boardGrid, useImageBackground && styles.boardGridTransparent]} />
          <View pointerEvents="none" style={styles.gridOverlay}>
            {renderGridLines()}
            {renderBoardBounds()}
          </View>
          {localShapes.map((shape: any, idx: number) => renderShape(shape, idx))}

          {tool === 'draw' && draftPoints.length > 1 && renderLineSegments(
            'draft-draw',
            draftPoints[0].x,
            draftPoints[0].y,
            draftPoints[1].x,
            draftPoints[1].y,
            penColor,
            lineThickness,
            lineType,
          )}

          {tool === 'freehand' && draftPoints.length > 1 &&
            draftPoints.slice(1).map((point, idx) => {
              const prev = draftPoints[idx];
              return (
                <View
                  key={`draft-${idx}`}
                  style={lineStyle(prev.x, prev.y, point.x, point.y, penColor, brushThickness)}
                />
              );
            })}

          {draftShape && renderShape(draftShape, -1, true)}

          {!canEdit && (
            <View style={styles.readOnlyBadge} pointerEvents="none">
              <FontAwesome5 name="lock" size={10} color="#475569" />
              <Text style={styles.readOnlyText}>View only</Text>
            </View>
          )}
        </View>

        <Modal
          visible={isTextEditorVisible}
          animationType="fade"
          transparent
          onRequestClose={closeTextEditor}
        >
          <View style={styles.pickerModalBackdrop}>
            <View style={[styles.textEditorCard, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', borderColor: theme.borderColor }]}>
              <Text style={[styles.textEditorTitle, { color: theme.textColor }]}>
                {editingTextIndex !== null ? 'Edit text' : 'Add text'}
              </Text>
              <Text style={[styles.textEditorHint, { color: theme.mutedTextColor }]}>
                Tap inside the highlighted board area to position text, then save it here.
              </Text>
              <TextInput
                style={[
                  styles.textEditorInput,
                  {
                    backgroundColor: theme.inputBackgroundColor,
                    borderColor: theme.borderColor,
                    color: theme.inputTextColor,
                  },
                ]}
                value={textDraftValue}
                onChangeText={setTextDraftValue}
                placeholder="Enter text"
                placeholderTextColor={theme.placeholderTextColor}
                autoFocus
                multiline
                textAlignVertical="top"
              />
              <View style={styles.textEditorActions}>
                <TouchableOpacity
                  style={[styles.textEditorButton, styles.textEditorButtonSecondary, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}
                  onPress={closeTextEditor}
                >
                  <Text style={[styles.textEditorButtonText, { color: theme.textColor }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textEditorButton} onPress={saveTextEntry}>
                  <Text style={styles.textEditorButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isColorPickerVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsColorPickerVisible(false)}
        >
          <View style={styles.pickerModalBackdrop}>
            <View style={[styles.pickerModalCard, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', borderColor: theme.borderColor }]}>
              <ColorPicker
                style={{ width: '100%', height: 320 }}
                value={penColor}
                onComplete={handlePenColorSelect}
              >
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
              </ColorPicker>
              <TouchableOpacity
                style={styles.pickerDoneButton}
                onPress={() => setIsColorPickerVisible(false)}
              >
                <Text style={styles.pickerDoneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );

  if (useInlineLayout) {
    return content;
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onWhiteboardClose}>
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inlineWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    padding: 10,
  },
  container: {
    flex: 1,
    maxHeight: '100%',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inlineContainer: {
    margin: 0,
    borderRadius: 12,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  } as any,
  headerTitleGroup: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  } as any,
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subText: {
    fontSize: 12,
    marginTop: 2,
  },
  statusPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  } as any,
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  headerToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarBlock: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 8,
    flexShrink: 0,
  } as any,
  inlineToolbarBlock: {
    marginTop: 12,
  },
  toolbarActionsRow: {
    gap: 8,
    paddingRight: 4,
  } as any,
  inlineToolbarRow: {
    gap: 8,
    paddingRight: 4,
    alignItems: 'center',
  } as any,
  toolbarIconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarDangerButton: {
    backgroundColor: 'rgba(127, 29, 29, 0.85)',
    borderColor: '#ef4444',
  },
  toolbarStatusButton: {
    minWidth: 56,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  toolsRow: {
    gap: 8,
    paddingRight: 4,
  } as any,
  toolButton: {
    minHeight: 38,
    minWidth: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  } as any,
  compactToolButton: {
    minWidth: 40,
    paddingHorizontal: 10,
    gap: 0,
  },
  toolButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa',
  },
  toolText: {
    fontSize: 12,
    fontWeight: '800',
  },
  shapeRow: {
    gap: 8,
    paddingRight: 4,
  } as any,
  shapeSlot: {
    height: 34,
  },
  shapeButton: {
    minHeight: 34,
    minWidth: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
  } as any,
  shapeButtonActive: {
    backgroundColor: '#0f766e',
    borderColor: '#2dd4bf',
  },
  shapeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  paletteRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorTriggerButton: {
    minWidth: 118,
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorTriggerButtonCompact: {
    minWidth: 44,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  inlinePickerWrap: {
    minWidth: 88,
    justifyContent: 'center',
  },
  colorTriggerSwatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  colorTriggerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
  },
  paletteMetaWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
  } as any,
  metaPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
  },
  colorSwatchActive: {
    transform: [{ scale: 1.08 }],
  },
  paletteMeta: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  settingsPanel: {
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
  } as any,
  settingRow: {
    gap: 8,
  } as any,
  settingLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRail: {
    gap: 8,
    paddingRight: 4,
  } as any,
  optionChip: {
    minHeight: 34,
    minWidth: 66,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa',
  },
  optionChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  boardSurface: {
    flex: 1,
    minHeight: 220,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inlineToolbarToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 24,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineToolbarToggleButton: {
    marginLeft: 4,
  },
  boardGrid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14, 165, 233, 0.035)',
  },
  boardGridTransparent: {
    backgroundColor: 'transparent',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  boardBoundsFrame: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  readOnlyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(241,245,249,0.9)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  } as any,
  readOnlyText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
  },
  pickerModalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  pickerModalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  pickerDoneButton: {
    alignSelf: 'flex-end',
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  pickerDoneButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  textEditorCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  textEditorTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  textEditorHint: {
    fontSize: 12,
    lineHeight: 18,
  },
  textEditorInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textEditorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  } as any,
  textEditorButton: {
    minWidth: 88,
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  textEditorButtonSecondary: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  textEditorButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  actionDock: {
    padding: 12,
    gap: 8,
  } as any,
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  } as any,
  commandRail: {
    gap: 8,
    paddingRight: 4,
  } as any,
  uploadRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  } as any,
  urlInput: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  commandButton: {
    minWidth: 88,
    minHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  } as any,
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
  },
  buttonSecondary: {
    backgroundColor: '#475569',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
});

export default Whiteboard;
