import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const MaintenanceMode = async () => {
  return await axios.get('/statics/user/maintenance-mode/v1')
}

export default function useMaintenanceMode () {
  const queryData = useQuery({
    queryKey: ['MaintenanceMode'],
    queryFn: MaintenanceMode,
    select: response => response?.data?.data
  })
  return { ...queryData }
}
