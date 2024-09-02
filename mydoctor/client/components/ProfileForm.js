import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../styles/authStyles'
import { Text, Input, CheckBox, Button } from 'react-native-elements';

export default function ProfileForm(props) {

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .required('username required'),
        email: yup
            .string()
            .email("Email must be entered correctly")
            .required('Email required'),
        password: yup
            .string()
            .required('Password required')
            .min(5, "password should be at least 6 characters"),
        userType: yup.boolean(),
        specialization: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required("Specialization required")
        }),
        address: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('Address required'),
        }),
        phone: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('Phone required'),
        }),
        workingHours: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('Working hours required'),
        }),

    })


    return(
        <Formik
        initialValues={{
          name: props.user?.name || '',
          email: props.user?.email || '',
          password: '',
          userType: props.user?.userType == 'doctor',
          specialization: props.user?.profile?.specialization || '',
          workingHours: props.user?.profile?.workingHours || '',
          address: props.user?.profile?.address || '',
          phone: props.user?.profile?.phone || '',
          latitude: props.user?.latitude || null,
          longitude: props.user?.longitude || null
        }}
        validationSchema={validationSchema}
        onSubmit={values => props.submit(values)}
        >
          {
            ({handleChange, handleBlur, handleSubmit, errors, values, setFieldValue, isValid}) => (
              <>
              <Input
                name="name"
                placeholder='Name'
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                style={[styles.textInput, errors.name && styles.errorInput]}
              />
              {errors.name && <Text p style={styles.textError}>{errors.name}</Text>}
              <Input
                name="email"
                onChangeText={handleChange('email')}
                disabled={props.disabled}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                placeholder='Email'
                style={[styles.textInput, errors.email && styles.errorInput]}
              />
              {errors.email && <Text p style={styles.textError}>{errors.email}</Text>}
              <Input
                name="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                placeholder="Password"
                style={[styles.textInput, errors.password && styles.errorInput]}
              />
              {errors.password && <Text p style={styles.textError}>{errors.password}</Text>}
              {
                props.checkBox &&
              <CheckBox
              checked={values.userType}
              title="I am a doctor"
              name="userType"
              onPress={() => setFieldValue('userType', !values.userType)}
              />
              }
              {values.userType && (
              <>
              <Input
                name="specialization"
                onChangeText={handleChange('specialization')}
                onBlur={handleBlur('specialization')}
                value={values.specialization}
                placeholder="Speciallization"
                style={[styles.textInput, errors.specialization && styles.errorInput]}
              />
              {errors.specialization && <Text p style={styles.textError}>{errors.specialization}</Text>}
              <Input
                name="workingHours"
                onChangeText={handleChange('workingHours')}
                onBlur={handleBlur('workingHours')}
                value={values.workingHours}
                placeholder="Working Hours"
                style={[styles.textInput, errors.workingHours && styles.errorInput]}
              />
              {errors.workingHours && <Text p style={styles.textError}>{errors.workingHours}</Text>}
              <Input
                name="address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                placeholder="Address"
                style={[styles.textInput, errors.address && styles.errorInput]}
              />
              {errors.address && <Text p style={styles.textError}>{errors.address}</Text>}
              <Input
                name="phone"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                placeholder="Phone"
                style={[styles.textInput, errors.phone && styles.errorInput]}
              />
              {errors.phone && <Text p style={styles.textError}>{errors.phone}</Text>}
            </>
          )}
          <Button title={props.buttonTitle} style={{ marginTop: '20px'}} onPress={handleSubmit} disabled={!isValid} />
        </>
      )
    }
  </Formik>
  )
}