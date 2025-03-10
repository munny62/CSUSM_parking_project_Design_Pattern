#pragma once
#include <string>
#include <vector>
#include <memory>
#include "ParkingSpot.hpp"
#include "../location/Location.hpp"

// Composite Pattern
class ParkingLot {
private:
    std::string name;
    Location location;
    std::vector<std::shared_ptr<ParkingSpot>> spots;
    
public:
    ParkingLot(const std::string& name, int capacity, const Location& location);
    bool isFull() const;
    std::vector<std::shared_ptr<ParkingSpot>> getAvailableSpots() const;
    std::vector<std::shared_ptr<ParkingSpot>> getReservableSpots(const TimeSlot& timeSlot) const;
};