import { Select } from '@chakra-ui/react'
import { MdOutlineCategory } from 'react-icons/md'

export default function Categories ({ values, onSelect, isLoading }) {
  let options = [<option key={''} value={''} />, ...values.map(category => <option key={category} value={category}>{category}</option>)]
  return (
    <div className='categories'>
      <Select
        icon={<MdOutlineCategory color='gray.600' />}
        iconColor={'gray.600'}
        variant='filled'
        onChange={e => onSelect(e.target.value)}
        disabled={isLoading}>
        {options}
      </Select>
    </div>
  )
}
