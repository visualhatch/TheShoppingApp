import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useDispatch, useSelector } from "react-redux";

import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Alert,
    Platform,
    Text,
    Button,
    ActivityIndicator
} from 'react-native';
import {HeaderButtons, Item} from "react-navigation-header-buttons";

import HeaderButton from '../../components/UI/HeaderButton';

import Input from "../../components/UI/Input";

import * as productsActions from '../../store/actions/products'
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    }
    return state;
};

const EditProductScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );

    const dispatch = useDispatch();


    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        forIsValid: editedProduct ? true : false
    });


    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error, [{
                text: 'Ok'
            }])
        }
    }, [error]);

    const submitHandler = useCallback(async () =>{
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!!', 'Please check errors in the form!!', [
                {text: 'Okay'}
            ]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (editedProduct) {
                await dispatch(
                    productsActions.updateProduct(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl)
                )
            } else {
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl,
                        +formState.inputValues.price))
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error.message)
        }

        setIsLoading(false)
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({submit: submitHandler});
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if (isLoading) {
        return (
            <View style={styles.isLoadingContainer}>
                <ActivityIndicator
                    size={'large'}
                    color={Colors.primary}
                />
            </View>
        )
    }

 return (
     <KeyboardAvoidingView
         style={styles.keyboardView}
         behavior={'padding'}
         keyboardVerticalOffset={100}
     >
         <ScrollView>
             <View style={styles.form}>
                 <Input
                     id={'title'}
                     label={'Title'}
                     errorText={'Please enter a valid title!'}
                     keyboardType={'default'}
                     autoCapitalize={'sentences'}
                     autoCorrect
                     returnKeyType={'next'}
                     onInputChange={inputChangeHandler}
                     initialValue={editedProduct ? editedProduct.title : ''}
                     initiallyValid={!!editedProduct}
                     required
                 />
                 <Input
                     id={'imageUrl'}
                     label={'Image URL'}
                     errorText={'Please enter a valid image URL!'}
                     keyboardType={'default'}
                     returnKeyType={'next'}
                     onInputChange={inputChangeHandler}
                     initialValue={editedProduct ? editedProduct.imageUrl : ''}
                     initiallyValid={!!editedProduct}
                     required
                 />

                 {editedProduct ? null : (
                     <Input
                         id={'price'}
                         label={'Price'}
                         errorText={'Please enter a valid price!'}
                         onInputChange={inputChangeHandler}
                         keyboardType={'decimal-pad'}
                         returnKeyType={'next'}
                         required
                         min={0.1}
                     />
                 )
                 }
                 <Input
                     id={'description'}
                     label={'Description'}
                     errorText={'Please enter a valid description!'}
                     onInputChange={inputChangeHandler}
                     keyboardType={'default'}
                     autoCapitalize={'sentences'}
                     autoCorrect
                     multiline
                     numberOfLine={3}
                     initialValue={editedProduct ? editedProduct.description : ''}
                     initiallyValid={!!editedProduct}
                     required
                     minLength={5}
                 />
             </View>

         </ScrollView>
     </KeyboardAvoidingView>


 );
};

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit')
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title={'Save'}
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>
        ),
    }
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1
    },
    form: {
        margin: 20
    },
    isLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;