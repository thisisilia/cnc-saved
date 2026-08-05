import { useEffect, useState } from 'react';
import { lookupRegistration } from '../../data/addVehicle';
import BottomSheet from '../BottomSheet';
import SlideStep from '../SlideStep';
import ConditionStep from './ConditionStep';
import FindVehicleStep from './FindVehicleStep';
import RegistrationStep from './RegistrationStep';
import ValuationVehicleStep from './ValuationVehicleStep';

/** Sheets never come closer than this to the top edge. */
const SHEET_TOP_INSET = 40;

/** Only copy lookup values the form actually has a field for. */
const pickKnown = (shape, found = {}) =>
  Object.fromEntries(Object.entries(found).filter(([key]) => key in shape));

const EMPTY_FIELDS = { year: '', variant: '', bodyType: '' };

/**
 * Value my car — PRD section 6, steps 1–3.
 *
 * Mirrors the add-vehicle flow but stops at condition: registration or search →
 * a lighter "Your vehicle" (enough to price it) → condition. `onComplete` hands
 * back everything the estimate result page needs.
 */
export default function AddValuationFlow({ visible, onClose, onComplete }) {
  const [step, setStep] = useState('registration');
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
  const [ownership, setOwnership] = useState(null);
  const [conditionId, setConditionId] = useState(null);

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
      setOwnership(null);
      setConditionId(null);
    }, 250);
    return () => clearTimeout(timer);
  }, [visible]);

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
    setVehicle({ title: entry.label, make: entry.make });
    go('search-vehicle');
  };

  const uk = step === 'uk-vehicle';

  const back = {
    registration: onClose,
    search: () => go('registration', -1),
    'uk-vehicle': () => go('registration', -1),
    'search-vehicle': () => go('search', -1),
    condition: () => go(vehicle?.registration ? 'uk-vehicle' : 'search-vehicle', -1),
  };

  const finish = () =>
    onComplete({
      mode: vehicle?.registration ? 'uk' : 'search',
      vehicle,
      fields,
      mileage,
      unit,
      notApplicable,
      ownership,
      conditionId,
    });

  return (
    <BottomSheet visible={visible} onClose={onClose} topInset={SHEET_TOP_INSET} fill>
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
          <FindVehicleStep query={query} onChangeQuery={setQuery} onBack={back.search} onSelect={chooseFromCatalogue} />
        )}

        {(step === 'uk-vehicle' || step === 'search-vehicle') && vehicle && (
          <ValuationVehicleStep
            mode={uk ? 'uk' : 'search'}
            vehicle={vehicle}
            fields={fields}
            onChangeField={changeField}
            mileage={mileage}
            onChangeMileage={setMileage}
            unit={unit}
            onChangeUnit={setUnit}
            notApplicable={notApplicable}
            onChangeNotApplicable={setNotApplicable}
            ownership={ownership}
            onChangeOwnership={setOwnership}
            onBack={back[step]}
            onContinue={() => go('condition')}
          />
        )}

        {step === 'condition' && (
          <ConditionStep
            vehicleTitle={vehicle?.title}
            value={conditionId}
            onChange={setConditionId}
            onBack={back.condition}
            onContinue={finish}
          />
        )}
      </SlideStep>
    </BottomSheet>
  );
}
