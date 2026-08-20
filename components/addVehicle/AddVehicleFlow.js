import { useEffect, useState } from 'react';
import { lookupRegistration } from '../../data/addVehicle';
import BottomSheet from '../BottomSheet';
import SlideStep from '../SlideStep';
import DatePickerSheet from '../DatePickerSheet';
import ConditionStep from './ConditionStep';
import FindVehicleStep from './FindVehicleStep';
import InsuranceStep from './InsuranceStep';
import PurchaseStep from './PurchaseStep';
import RegistrationStep from './RegistrationStep';
import YourVehicleStep from './YourVehicleStep';

const EMPTY_PURCHASE = { year: '', price: '', currency: 'GBP', source: '' };

/** Sheets never come closer than this to the top edge. */
const SHEET_TOP_INSET = 40;

/** Only copy lookup values the form actually has a field for. */
const pickKnown = (shape, found = {}) =>
  Object.fromEntries(Object.entries(found).filter(([key]) => key in shape));

// Every field the form can show — pickKnown only copies keys present here, so
// a missing key silently discards its looked-up value.
const EMPTY_FIELDS = {
  registration: '',
  generation: '',
  variant: '',
  bodyType: '',
  year: '',
  engine: '',
  colour: '',
  fuel: '',
  transmission: '',
  gears: '',
  steering: '',
};

/**
 * Add to My Garage — PRD step 1 (Vehicle information).
 *
 * Two regional paths converge on "Your vehicle": UK enters a registration and
 * has its details looked up; non-UK searches the make/model catalogue and fills
 * the rest in by hand. Purchase information, condition, history and photos are
 * later steps and are not built yet — `onComplete` is where they hook on.
 */
export default function AddVehicleFlow({ visible, onClose, onComplete, resumeDraft, onStepChange }) {
  const [step, setStep] = useState('registration');
  // Report the live step up so the host can reflect it in the URL.
  useEffect(() => {
    if (visible) onStepChange?.(step);
  }, [visible, step, onStepChange]);
  // Direction of the last step change, so the content slides like a nav push/pop.
  const [dir, setDir] = useState(1);
  const go = (next, d = 1) => {
    setDir(d);
    setStep(next);
  };
  const [registration, setRegistration] = useState('');
  const [query, setQuery] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [mileage, setMileage] = useState('');
  const [unit, setUnit] = useState('miles');
  const [notApplicable, setNotApplicable] = useState(false);
  const [insuranceRenewal, setInsuranceRenewal] = useState('');
  const [purchase, setPurchase] = useState(EMPTY_PURCHASE);
  const [conditionId, setConditionId] = useState(null);
  // A date/year picker stacked over the flow hides the flow's own grab handle.
  const [pickerOpen, setPickerOpen] = useState(false);
  // Steps inside a ScrollView (Your vehicle) route their picker to the flow root
  // so the sheet isn't clipped by the scroll overflow.
  const [datePicker, setDatePicker] = useState(null);
  const setPurchaseField = (key, value) => setPurchase((prev) => ({ ...prev, [key]: value }));

  // Reset once dismissed, so reopening starts a fresh vehicle rather than
  // resuming a half-finished one.
  useEffect(() => {
    if (visible) return;
    const timer = setTimeout(() => {
      setStep('registration');
      setRegistration('');
      setQuery('');
      setVehicle(null);
      setFields(EMPTY_FIELDS);
      setMileage('');
      setUnit('miles');
      setNotApplicable(false);
      setInsuranceRenewal('');
      setPurchase(EMPTY_PURCHASE);
      setConditionId(null);
    }, 250);
    return () => clearTimeout(timer);
  }, [visible]);

  // Resuming a dropped-off draft: seed the collected values and reopen at the
  // step the user left (usually the condition step they were about to enter).
  useEffect(() => {
    if (!visible || !resumeDraft) return;
    setVehicle({
      title: resumeDraft.title,
      make: resumeDraft.make,
      registration: resumeDraft.registration,
    });
    setFields({ ...EMPTY_FIELDS, ...pickKnown(EMPTY_FIELDS, resumeDraft) });
    setMileage(resumeDraft.mileage || '');
    setUnit(resumeDraft.unit || 'miles');
    setNotApplicable(Boolean(resumeDraft.notApplicable));
    setConditionId(resumeDraft.conditionId || null);
    setStep(resumeDraft.resumeStep || 'condition');
  }, [visible, resumeDraft]);

  const changeField = (id, value) => setFields((prev) => ({ ...prev, [id]: value }));

  const lookUp = () => {
    const found = lookupRegistration(registration);
    setVehicle(found);
    // Everything the lookup resolved lands in the form, so "Edit vehicle
    // details" opens populated rather than blank.
    setFields((prev) => ({ ...prev, ...pickKnown(prev, found.fields) }));
    go('uk-vehicle');
  };

  const chooseFromCatalogue = (entry) => {
    // `make` is what resolves the manufacturer logo downstream.
    setVehicle({ title: entry.label, make: entry.make });
    go('manual-vehicle');
  };

  // Progress worth keeping if the sheet is dismissed: once a vehicle is chosen,
  // hand the collected values back so the drop-off can be resumed later.
  const partialDraft = () => {
    if (!vehicle) return null;
    return {
      ...vehicle,
      ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== '')),
      conditionId,
      mileage,
      unit,
      notApplicable,
      purchase,
      insuranceRenewal,
      resumeStep: step,
    };
  };
  const handleClose = () => onClose(partialDraft());

  const back = {
    registration: handleClose,
    search: () => go('registration', -1),
    'uk-vehicle': () => go('registration', -1),
    'manual-vehicle': () => go('search', -1),
    insurance: () => go(vehicle?.registration ? 'uk-vehicle' : 'manual-vehicle', -1),
    purchase: () => go('insurance', -1),
    condition: () => go('purchase', -1),
  };

  // Vehicle information and condition are collected in the sheet; the rest of
  // the profile is built on the full-page checklist.
  const finishSheet = () =>
    onComplete({
      ...vehicle,
      // Only fields the user actually filled — a blank manual field must not
      // clobber a value the registration lookup already resolved.
      ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== '')),
      conditionId,
      mileage,
      unit,
      notApplicable,
      purchase,
      insuranceRenewal,
    });

  return (
    <>
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      topInset={SHEET_TOP_INSET}
      // Every step fills the same height, so the sheet never resizes between steps.
      fill
      hideGrabber={pickerOpen || Boolean(datePicker)}
    >
      <SlideStep stepKey={step} direction={dir}>
        {step === 'registration' && (
          <RegistrationStep
            registration={registration}
            onChangeRegistration={setRegistration}
            onBack={back.registration}
            onContinue={lookUp}
            onSkip={() => go('search')}
          />
        )}

        {step === 'search' && (
          <FindVehicleStep
            query={query}
            onChangeQuery={setQuery}
            onBack={back.search}
            onSelect={chooseFromCatalogue}
          />
        )}

        {(step === 'uk-vehicle' || step === 'manual-vehicle') && vehicle && (
          <YourVehicleStep
            mode={step === 'uk-vehicle' ? 'uk' : 'manual'}
            vehicle={vehicle}
            fields={fields}
            onChangeField={changeField}
            mileage={mileage}
            onChangeMileage={setMileage}
            unit={unit}
            onChangeUnit={setUnit}
            notApplicable={notApplicable}
            onChangeNotApplicable={setNotApplicable}
            onBack={back[step]}
            onEditDetails={() => go('manual-vehicle')}
            onContinue={() => go('insurance')}
          />
        )}

        {step === 'insurance' && (
          <InsuranceStep
            value={insuranceRenewal}
            onChange={setInsuranceRenewal}
            onBack={back.insurance}
            onContinue={() => go('purchase')}
            onRequestPicker={setDatePicker}
            pickerOpen={Boolean(datePicker)}
          />
        )}

        {step === 'purchase' && (
          <PurchaseStep
            purchase={purchase}
            onChange={setPurchaseField}
            onBack={back.purchase}
            onContinue={() => go('condition')}
            onPickerOpenChange={setPickerOpen}
          />
        )}

        {step === 'condition' && (
          <ConditionStep
            vehicleTitle={vehicle?.title}
            value={conditionId}
            onChange={setConditionId}
            onBack={back.condition}
            onContinue={finishSheet}
          />
        )}
      </SlideStep>
    </BottomSheet>

    <DatePickerSheet
      visible={Boolean(datePicker)}
      mode={datePicker?.mode ?? 'date'}
      value={datePicker?.value}
      onClose={() => setDatePicker(null)}
      onConfirm={(v) => datePicker?.onConfirm(v)}
    />
    </>
  );
}
