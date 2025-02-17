import {
  Alert,
  AlertTitle,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import UserDefinesList from '../UserDefinesList';
import {
  DeviceTarget,
  UserDefine,
  UserDefineKey,
  UserDefinesMode,
} from '../../gql/generated/types';

const useStyles = makeStyles((theme) => ({
  categoryTitle: {
    marginBottom: theme.spacing(1),
  },
  option: {
    padding: `${theme.spacing(1, 2)} !important`,
  },
  icon: {
    minWidth: 40,
  },
  userDefinesMode: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 0, 2, 1),
  },
  radioControl: {
    marginRight: `${theme.spacing(4)} !important`,
  },
  radio: {
    marginRight: `${theme.spacing(1)} !important`,
  },
  textarea: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface DeviceOptionsFormData {
  userDefinesMode: UserDefinesMode;
  userDefineOptions: UserDefine[];
  userDefinesTxt: string;
}

interface DeviceOptionsFormProps {
  target: DeviceTarget | null;
  deviceOptions: DeviceOptionsFormData;
  onChange: (data: DeviceOptionsFormData) => void;
}

enum UserDefineCategory {
  RegulatoryDomains = 'REGULATORY_DOMAINS',
  BindingPhrase = 'BINDING_PHRASE',
  ExtraData = 'EXTRA_DATA',
  PerformanceOptions = 'PERFORMANCE_OPTIONS',
  CompatibilityOptions = 'COMPATIBILITY_OPTIONS',
  OtherOptions = 'OTHER_OPTIONS',
  NetworkOptions = 'NETWORK_OPTIONS',
}

export type UserDefinesByCategory = {
  [key in UserDefineCategory]: UserDefine[];
};

export type UserDefinesKeysByCategory = {
  [key in UserDefineCategory]: UserDefineKey[];
};

const userDefinesToCategories = (
  userDefines: UserDefine[]
): UserDefinesByCategory => {
  const result: UserDefinesByCategory = {
    [UserDefineCategory.RegulatoryDomains]: [],
    [UserDefineCategory.BindingPhrase]: [],
    [UserDefineCategory.ExtraData]: [],
    [UserDefineCategory.PerformanceOptions]: [],
    [UserDefineCategory.CompatibilityOptions]: [],
    [UserDefineCategory.NetworkOptions]: [],
    [UserDefineCategory.OtherOptions]: [],
  };

  const keysToCategories: UserDefinesKeysByCategory = {
    [UserDefineCategory.RegulatoryDomains]: [
      UserDefineKey.REGULATORY_DOMAIN_AU_915,
      UserDefineKey.REGULATORY_DOMAIN_EU_868,
      UserDefineKey.REGULATORY_DOMAIN_FCC_915,
      UserDefineKey.REGULATORY_DOMAIN_IN_866,
      UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
    ],
    [UserDefineCategory.BindingPhrase]: [UserDefineKey.BINDING_PHRASE],
    [UserDefineCategory.ExtraData]: [
      UserDefineKey.HYBRID_SWITCHES_8,
      UserDefineKey.ENABLE_TELEMETRY,
      UserDefineKey.TLM_REPORT_INTERVAL_MS,
    ],
    [UserDefineCategory.PerformanceOptions]: [
      UserDefineKey.FAST_SYNC,
      UserDefineKey.NO_SYNC_ON_ARM,
      UserDefineKey.ARM_CHANNEL,
      UserDefineKey.FEATURE_OPENTX_SYNC,
      UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
      UserDefineKey.LOCK_ON_FIRST_CONNECTION,
      UserDefineKey.LOCK_ON_50HZ,
      UserDefineKey.USE_500HZ,
      UserDefineKey.USE_DIVERSITY,
    ],
    [UserDefineCategory.CompatibilityOptions]: [
      UserDefineKey.UART_INVERTED,
      UserDefineKey.USE_UART2,
      UserDefineKey.R9M_UNLOCK_HIGHER_POWER, // deprecated
      UserDefineKey.UNLOCK_HIGHER_POWER,
      UserDefineKey.USE_R9MM_R9MINI_SBUS,
    ],
    [UserDefineCategory.NetworkOptions]: [
      UserDefineKey.AUTO_WIFI_ON_BOOT,
      UserDefineKey.AUTO_WIFI_ON_INTERVAL,
      UserDefineKey.HOME_WIFI_SSID,
      UserDefineKey.HOME_WIFI_PASSWORD,
    ],
    [UserDefineCategory.OtherOptions]: [
      UserDefineKey.BLE_HID_JOYSTICK,
      UserDefineKey.USE_ESP8266_BACKPACK,
      UserDefineKey.JUST_BEEP_ONCE,
      UserDefineKey.DISABLE_STARTUP_BEEP,
      UserDefineKey.MY_STARTUP_MELODY,
      UserDefineKey.USE_DYNAMIC_POWER,
    ],
  };

  const defineToCategory = (key: UserDefineKey): UserDefineCategory => {
    const cats: UserDefineCategory[] = Object.keys(
      keysToCategories
    ) as UserDefineCategory[];
    for (let i = 0; i < cats.length; i++) {
      const defineCategory = cats[i];
      if (keysToCategories[defineCategory].indexOf(key) > -1) {
        return cats[i];
      }
    }
    throw new Error(`failed to find category for ${key}`);
  };

  userDefines.forEach((userDefine) => {
    result[defineToCategory(userDefine.key)].push(userDefine);
  });

  return result;
};

const DeviceOptionsForm: FunctionComponent<DeviceOptionsFormProps> = (
  props
) => {
  const styles = useStyles();
  const { target, deviceOptions, onChange } = props;
  const categories = userDefinesToCategories(deviceOptions.userDefineOptions);

  const onOptionUpdate = (data: UserDefine) => {
    const updatedOptions = deviceOptions?.userDefineOptions.map((opt) => {
      if (opt.key === data.key) {
        return {
          ...data,
        };
      }
      return opt;
    });
    onChange({
      ...deviceOptions,
      userDefineOptions: updatedOptions,
    });
  };

  const onUserDefinesTxt = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange({
      ...deviceOptions,
      userDefinesTxt: event.currentTarget.value,
    });
  };

  const onUserDefinesMode = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    onChange({
      ...deviceOptions,
      userDefinesMode: value as UserDefinesMode,
    });
  };

  return (
    <div>
      <FormControl component="fieldset" className={styles.userDefinesMode}>
        <RadioGroup
          row
          value={deviceOptions.userDefinesMode}
          onChange={onUserDefinesMode}
          defaultValue="top"
        >
          <FormControlLabel
            value={UserDefinesMode.UserInterface}
            className={styles.radioControl}
            control={<Radio className={styles.radio} color="primary" />}
            label="Standard mode"
          />
          <FormControlLabel
            value={UserDefinesMode.Manual}
            className={styles.radioControl}
            control={<Radio className={styles.radio} color="primary" />}
            label="Manual mode"
          />
        </RadioGroup>
      </FormControl>
      {target === null &&
        deviceOptions.userDefinesMode === UserDefinesMode.UserInterface && (
          <Alert severity="info">
            <AlertTitle>Notice</AlertTitle>
            Please select a firmware version and device target first
          </Alert>
        )}
      {deviceOptions.userDefinesMode === UserDefinesMode.Manual && (
        <>
          <TextField
            className={styles.textarea}
            multiline
            label="user_defines.txt"
            onBlur={onUserDefinesTxt}
            defaultValue={deviceOptions.userDefinesTxt}
            fullWidth
            rows={10}
          />
        </>
      )}
      {target !== null &&
        categories !== null &&
        deviceOptions.userDefinesMode === UserDefinesMode.UserInterface && (
          <>
            <Grid container spacing={3}>
              <Grid item xs>
                {categories[UserDefineCategory.RegulatoryDomains]?.length >
                  0 && (
                  <>
                    <Typography variant="h6" className={styles.categoryTitle}>
                      Regulatory domains
                    </Typography>
                    <UserDefinesList
                      options={categories[UserDefineCategory.RegulatoryDomains]}
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
                {categories[UserDefineCategory.BindingPhrase]?.length > 0 && (
                  <>
                    <Typography variant="h6">Binding phrase setup</Typography>
                    <UserDefinesList
                      options={categories[UserDefineCategory.BindingPhrase]}
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
                {categories[UserDefineCategory.CompatibilityOptions]?.length >
                  0 && (
                  <>
                    <Typography variant="h6">Compatibility options</Typography>
                    <UserDefinesList
                      options={
                        categories[UserDefineCategory.CompatibilityOptions]
                      }
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
              </Grid>

              <Grid item xs>
                {categories[UserDefineCategory.PerformanceOptions]?.length >
                  0 && (
                  <>
                    <Typography variant="h6">Performance options</Typography>
                    <UserDefinesList
                      options={
                        categories[UserDefineCategory.PerformanceOptions]
                      }
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
                {categories[UserDefineCategory.ExtraData]?.length > 0 && (
                  <>
                    <Typography variant="h6">Extra data</Typography>
                    <UserDefinesList
                      options={categories[UserDefineCategory.ExtraData]}
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
                {categories[UserDefineCategory.NetworkOptions]?.length > 0 && (
                  <>
                    <Typography variant="h6">Network</Typography>
                    <UserDefinesList
                      options={categories[UserDefineCategory.NetworkOptions]}
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
                {categories[UserDefineCategory.OtherOptions]?.length > 0 && (
                  <>
                    <Typography variant="h6">Other options</Typography>
                    <UserDefinesList
                      options={categories[UserDefineCategory.OtherOptions]}
                      onChange={onOptionUpdate}
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </>
        )}
    </div>
  );
};
export default DeviceOptionsForm;
