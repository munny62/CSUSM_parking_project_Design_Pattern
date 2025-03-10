#include <iostream>
#include "system/ParkingSystem.hpp"

int main() {
    ParkingSystem& system = ParkingSystem::getInstance(); // Singleton pattern
    system.start();
    return 0;
}