import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 18,
        color: '#333',
    },
    paragraph: {
        marginVertical: 8,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 200,
    },
    animalContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginTop: 20,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 28,
        width: "32.3%",
        height: 120,
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
        paddingBottom: 20,
    },
    innerCenter: {
        padding: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: 'stretch',
    },
    innerTimer: {
        padding: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    innerTop: {
        padding: 20,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'stretch',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    lottieView: {
        
    },
    modalView: {
        height: 300,
        width: 350,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#f28482",
        fontWeight: "bold",
        fontSize: 16
    }
});