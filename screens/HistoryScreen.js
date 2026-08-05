import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraCapture from '../components/addVehicle/CameraCapture';
import DocumentViewer from '../components/addVehicle/DocumentViewer';
import HistoryUploadSheet from '../components/addVehicle/HistoryUploadSheet';
import ManualEventSheet from '../components/addVehicle/ManualEventSheet';
import Toggle from '../components/Toggle';
import AppIcon from '../components/icons/AppIcon';
import Button from '../components/vehicle/Button';
import { ANALYSIS_TOTAL, SAMPLE_DOCUMENTS, analyseDocuments, makeUploads } from '../data/history';
import { useHistoryTarget } from '../state/photoTarget';
import { color, font, radius, spacing } from '../theme/tokens';

const DOT = 12;
const RAIL_X = 5;
/** Gap between each entry landing, for the staged reveal. */
const REVEAL_STAGGER_MS = 260;

/** One timeline entry, fading and sliding in as the analysis reaches it. */
function Entry({ entry, index, last, onOpenImage }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      delay: index * REVEAL_STAGGER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  return (
    <Animated.View
      style={[
        styles.entry,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        },
      ]}
    >
      <View style={styles.dotColumn}>
        <View style={styles.dot} />
      </View>
      <View style={[styles.entryBody, !last && styles.entrySpacing]}>
        <View style={styles.entryHead}>
          <Text style={styles.date}>{entry.date}</Text>
          {entry.mot && entry.status ? (
            <View style={styles.passed}>
              <Text style={styles.passedLabel}>{entry.status}</Text>
            </View>
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel={`Options for ${entry.date}`} hitSlop={8}>
              <Feather name="more-horizontal" size={18} color={color.icon.neutralRegular} />
            </Pressable>
          )}
        </View>
        {entry.mot && entry.mileage ? (
          <View style={styles.mileageRow}>
            <AppIcon name="dial" size={16} color={color.icon.neutralRegular} />
            <Text style={styles.mileage}>{entry.mileage}</Text>
          </View>
        ) : null}
        {entry.category ? <Text style={styles.category}>{entry.category}</Text> : null}
        {entry.description ? <Text style={styles.description}>{entry.description}</Text> : null}
        {entry.image ? (
          <Pressable
            onPress={() => onOpenImage(entry)}
            accessibilityRole="button"
            accessibilityLabel={`Open document for ${entry.date}`}
          >
            {/* Hidden from the listing reads as blurred here, so the timeline
                shows at a glance what a buyer would not see. */}
            <Image
              source={entry.image}
              style={styles.thumb}
              resizeMode="cover"
              blurRadius={entry.showOnListing === false ? 12 : 0}
            />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

/** "Creating your timeline…" while the documents are analysed. */
function Analysing({ remaining, onLeave }) {
  return (
    <View style={styles.analysing}>
      <View style={styles.analysingIcon}>
        <Feather name="git-merge" size={32} color={color.background.brandPrimarySubtle} />
      </View>
      <Text style={styles.analysingTitle}>Creating your timeline...</Text>
      <Text style={styles.analysingBody}>{remaining} photos left to analyse. No need to wait!</Text>
      <Button label="Come back later" onPress={onLeave} style={styles.analysingButton} />
    </View>
  );
}

/**
 * PRD step 4 — vehicle history.
 *
 * Documents are uploaded, analysed, and returned as a chronological timeline.
 * The entries reveal one by one, so the list reads as the system assembling it
 * rather than appearing all at once.
 */
export default function HistoryScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { history, setHistory } = useHistoryTarget(route.params?.id);
  const saved = history?.entries;
  const [stage, setStage] = useState(saved?.length ? 'timeline' : 'upload');
  const [entries, setEntries] = useState(saved ?? []);
  const [manualOpen, setManualOpen] = useState(false);
  const [showMot, setShowMot] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(!saved?.length);
  // The same sheet, but the info icon opens it as an explainer without the
  // upload sources; the flow entry points open it with them.
  const [sheetInfo, setSheetInfo] = useState(false);
  const openSheet = (info = false) => {
    setSheetInfo(info);
    setSheetOpen(true);
  };
  const [uploads, setUploads] = useState([]);
  const [viewing, setViewing] = useState(null);

  const pickPhotos = () => {
    setSheetOpen(false);
    setUploads((prev) => [...prev, ...makeUploads(9 - prev.length > 0 ? 9 - prev.length : 3)]);
    setStage('uploaded');
  };

  const openCamera = () => {
    setSheetOpen(false);
    setStage('camera');
  };

  /** The shutter is presentational — each press adds one canned scan. */
  const capture = () => setUploads((prev) => [...prev, ...makeUploads(1)]);

  const createTimeline = useCallback(async () => {
    setStage('analysing');
    const result = await analyseDocuments();
    setEntries(result);
    setStage('timeline');
  }, []);

  /**
   * The viewer opens over both the upload grid and the finished timeline, so a
   * change has to land in whichever list holds that document — and in the open
   * viewer itself, which renders from its own copy.
   */
  const patchDocument = (id, patch) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    setViewing((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const removeDocument = (id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setViewing(null);
  };

  const visible = entries.filter((entry) => showMot || !entry.mot);

  const done = () => {
    setHistory({ entries });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <Pressable
          onPress={() => (stage === 'timeline' ? done() : navigation.goBack())}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color={color.icon.neutralBold} />
        </Pressable>
        <Text style={styles.headerTitle}>Vehicle history</Text>
        {/* Info reopens the explainer — without its actions, per the brief. */}
        <Pressable
          onPress={() => openSheet(true)}
          accessibilityRole="button"
          accessibilityLabel="About vehicle history"
          hitSlop={8}
        >
          <Feather name="info" size={22} color={color.icon.neutralBold} />
        </Pressable>
      </View>

      {stage === 'uploaded' && (
        <>
          <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {uploads.map((upload) => (
              <Pressable
                key={upload.id}
                style={styles.gridCell}
                onPress={() => setViewing(upload)}
                accessibilityRole="button"
                accessibilityLabel="Uploaded document"
              >
                <Image source={upload.image} style={styles.gridImage} resizeMode="cover" />
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
            <View style={styles.actions}>
              <Button
                label="Add more"
                variant="secondary"
                leading={<Feather name="plus" size={18} color={color.text.neutralBold} />}
                onPress={() => openSheet(false)}
                style={styles.action}
              />
              <Button label="Create timeline" onPress={createTimeline} style={styles.action} />
            </View>
          </View>
        </>
      )}

      {stage === 'analysing' && <Analysing remaining={ANALYSIS_TOTAL} onLeave={() => navigation.goBack()} />}

      {stage === 'timeline' && (
        <>
          <View style={styles.motRow}>
            <Text style={styles.motLabel}>Show MOT events</Text>
            <Toggle value={showMot} onValueChange={setShowMot} accessibilityLabel="Show MOT events" />
          </View>

          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <View style={styles.timeline}>
              <View style={styles.rail} />
              {visible.map((entry, i) => (
                // Keying on the filter state restarts the reveal when the MOT
                // toggle changes the list, rather than leaving new rows blank.
                <Entry
                  key={`${entry.id}-${showMot}`}
                  entry={entry}
                  index={i}
                  last={i === visible.length - 1}
                  onOpenImage={setViewing}
                />
              ))}
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
            <View style={styles.actions}>
              <Button
                label="Add documents"
                variant="secondary"
                leading={<Feather name="plus" size={18} color={color.text.neutralBold} />}
                onPress={() => openSheet(false)}
                style={styles.action}
              />
            </View>
            <Pressable
              onPress={() => setManualOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Add an event manually"
            >
              <Text style={styles.manual}>Add an event manually</Text>
            </Pressable>
          </View>
        </>
      )}

      <HistoryUploadSheet
        visible={sheetOpen}
        infoOnly={sheetInfo}
        onClose={() => setSheetOpen(false)}
        onPickPhotos={pickPhotos}
        onOpenCamera={openCamera}
        onSkip={() => {
          setSheetOpen(false);
          navigation.goBack();
        }}
      />

      {stage === 'camera' && (
        <CameraCapture
          preview={SAMPLE_DOCUMENTS[0]}
          onCapture={capture}
          onDone={() => setStage(uploads.length ? 'uploaded' : 'upload')}
        />
      )}

      <ManualEventSheet
        visible={manualOpen}
        onClose={() => setManualOpen(false)}
        onAdd={(entry) => {
          // Newest first, matching how the analysed timeline is ordered.
          setEntries((prev) => [{ ...entry, id: `manual-${prev.length + 1}` }, ...prev]);
          setManualOpen(false);
        }}
      />

      <DocumentViewer
        visible={Boolean(viewing)}
        document={viewing}
        onClose={() => setViewing(null)}
        onToggleShow={(next) => patchDocument(viewing.id, { showOnListing: next })}
        onDelete={(doc) => removeDocument(doc.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
    textAlign: 'center',
  },
  motRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  motLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  list: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  // Thirds, minus the two gaps between them.
  gridCell: {
    width: '31.5%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  timeline: {
    gap: spacing[3],
  },
  rail: {
    position: 'absolute',
    left: RAIL_X,
    top: DOT / 2,
    bottom: DOT,
    width: 2,
    backgroundColor: color.background.brandPrimaryRegular,
    opacity: 0.4,
  },
  entry: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  dotColumn: {
    width: DOT,
    paddingTop: spacing[1],
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  entryBody: {
    flex: 1,
    gap: spacing[1],
  },
  entrySpacing: {
    paddingBottom: spacing[3],
  },
  entryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  passed: {
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  passedLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
  mileageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  mileage: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  date: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  category: {
    ...font.caption2Regular,
    color: color.text.neutralRegular,
  },
  description: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  thumb: {
    width: 96,
    height: 64,
    borderRadius: radius.lg,
    marginTop: spacing[1],
  },
  analysing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[6],
  },
  analysingIcon: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryRegular,
    marginBottom: spacing[2],
  },
  analysingTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  analysingBody: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  analysingButton: {
    alignSelf: 'stretch',
    marginTop: spacing[3],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    gap: spacing[3],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  // Buttons share the row; their labels are pinned to one line so a long one
  // widens the button rather than wrapping inside it.
  action: {
    flex: 1,
  },
  manual: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    textAlign: 'center',
  },
});
