package com.tubemogul.app;

import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;



public class Main extends Application<ParkMogulConfiguration> {
    private int totalSpotsAvailable;
    private Cars cars = new Cars();

    @Override
    public void run(ParkMogulConfiguration conf, Environment env) throws Exception {
        totalSpotsAvailable = conf.parkingCapacity;

        env.jersey().register(new CarSeen());
        env.jersey().register(new AvailableSpots());
    }

    public static void main(String[] args) throws Exception {
        new Main().run(args);
    }

    @Path("/car-seen")
    public class CarSeen {

        @POST
        public int carSeen(@QueryParam("plate") String plate) {
            cars.put(plate);
            return 0;
        }
    }

    @Path("/get-available-spots")
    public class AvailableSpots {


        @GET
        public int get() {
            return Math.max(totalSpotsAvailable - cars.total(), 0);
        }
    }
}
