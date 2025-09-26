import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const PaginationComponent = ({currentPage, totalPages, onPageChange}) => {
  return (
    <View style={styles.paginationContainer}>
      <View>
        <Text style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
          Pages {currentPage} to {totalPages}
        </Text>
      </View>
      {/* Previous Button */}
      <View style={{flexDirection: 'row', height: '100%'}}>
        <TouchableOpacity
          style={[styles.arrowButton, {opacity: currentPage === 1 ? 0.5 : 1}]}
          disabled={currentPage === 1}
          onPress={() => onPageChange(currentPage - 1)}>
          <Text style={styles.arrowText}>{`<<`}</Text>
        </TouchableOpacity>

        {/* Page Numbers */}
        <View style={styles.pageNumbers}>
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
            <TouchableOpacity
              key={page}
              onPress={() => onPageChange(page)}
              style={[
                styles.pageButton,
                currentPage === page && styles.activePageButton,
              ]}>
              <Text
                style={[
                  styles.pageText,
                  currentPage === page && styles.activePageText,
                ]}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.arrowButton,
            {opacity: currentPage === totalPages ? 0.5 : 1},
          ]}
          disabled={currentPage === totalPages}
          onPress={() => onPageChange(currentPage + 1)}>
          <Text style={styles.arrowText}>{`>>`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Props validation
PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// Styles
const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 10,
  },
  arrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    // borderRadius: 4,
    // borderWidth: 1,
    // borderColor: '#E72B4A',
  },
  arrowText: {
    color: '#E72B4A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    // marginHorizontal: 5,
    // borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E72B4A',
    backgroundColor: '#E72B4A',
  },
  activePageButton: {
    backgroundColor: '#E72B4A',
  },
  pageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activePageText: {
    color: '#fff',
  },
});

export default PaginationComponent;
