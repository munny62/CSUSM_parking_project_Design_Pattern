#pragma once
#include <memory>
#include "../parking/ParkingSpot.hpp"

// Factory Method Pattern
class ParkingSpotFactory {
public:
    static std::shared_ptr<ParkingSpot> createSpot(int spotId);
};