import { Input, InputGroup, InputLeftElement, IconButton, Flex } from '@chakra-ui/react'
import { SmallCloseIcon, SearchIcon } from '@chakra-ui/icons'


import Categories from './categories'

export default function Search({ categories, isLoading, searchQuery, onClearSearch, onNameSearch, onCategorySelection }) {
  return (
    <Flex gap={2}>
      <Categories
        values={categories}
        onSelect={onCategorySelection}
        isLoading={isLoading}
      />
      <div className='search'>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.600' />}
          />
          <Input
            variant="filled"
            className="searchField"
            value={searchQuery.param === 'name' ? searchQuery.value : ''}
            onChange={evt => onNameSearch(evt.target.value)}
          />
          <IconButton
            isDisabled={isLoading}
            className="clear-searchField"
            variant='unstyled'
            onClick={onClearSearch}
            icon={<SmallCloseIcon color='gray.300' />}
          />
        </InputGroup>
      </div>
    </Flex>
  )
}
