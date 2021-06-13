import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
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
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
        paddingBottom: 20,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
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