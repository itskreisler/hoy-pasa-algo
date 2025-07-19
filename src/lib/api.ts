import { createApi, type ArgsCreateApi } from '@kreisler/createapi'

const API: BackendAPI = createApi('http://127.0.0.1:5000/api/v1')

interface BackendAPI {
    registro: (_: undefined, __: undefined, ___: ArgsCreateApi) => Promise<{
        type: string;
        message: string;
        data: any;
    }>
}
export const register = async ({ email, password, name, usuario }: { email: string; password: string; name: string; usuario: string }) =>
    await API.registro(undefined, undefined, {
        body: JSON.stringify({ email, password, name, usuario }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
    })
