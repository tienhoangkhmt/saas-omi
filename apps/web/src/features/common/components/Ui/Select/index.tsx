import { Select, SelectButton, SelectList, SelectProps } from '@saas-ui/react'

interface ICustomSelect extends SelectProps {}

const CustomSelect: React.FC<ICustomSelect> = (props) => {
  return (
    <Select
      // name="interest"
      placeholder="Select your interests"
      options={[
        { value: 'Cars' },
        { value: 'Cooking' },
        { value: 'Reading' },
        { value: 'Hiking' },
        { value: 'Traveling' },
      ]}
      multiple
      {...props}
    >
      <SelectButton />
      <SelectList />
    </Select>
  )
}

export default CustomSelect
