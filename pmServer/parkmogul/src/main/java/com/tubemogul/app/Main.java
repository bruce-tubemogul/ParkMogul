package com.tubemogul.app;

import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;



public class Main extends Application<ParkMogulConfiguration> {
    private int totalSpotsAvailable;

    public int numberCars = 0;

    @Override
    public void run(ParkMogulConfiguration conf, Environment env) throws Exception {
        totalSpotsAvailable = conf.parkingCapacity;

        env.jersey().register(new CarArriving());
        env.jersey().register(new CarLeaving());
        env.jersey().register(new AvailableSpots());
    }

    public static void main(String[] args) throws Exception {
        new Main().run(args);
    }

    @Path("/car-arriving")
    public class CarArriving {

        @POST
        public void post() {
            numberCars++;
        }
    }

    @Path("/car-leaving")
    public class CarLeaving {

        @POST
        public void post() {
            if (numberCars <= 0) {
                throw new RuntimeException("There are no cars in, no one can leave!");
            } else {
                numberCars--;
            }
        }
    }

    @Path("/get-available-spots")
    public class AvailableSpots {


        @GET
        public int get() {
            return Math.max(totalSpotsAvailable - numberCars, 0);
        }
    }
}
