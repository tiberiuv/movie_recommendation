use hyper::server::{Request, Response, Service};

use futures::future::Future;

pub struct Microservice;

impl Service for Microservice {
    type Request = Request;
    type Response = Response;
    type Error = hyper::Error;
    type Future = Box<Future<Item = Self::Response, Error = Self::Error>>;

    fn call(&self, request: Request) -> Self::Future {
        info!("Microservice received a request: {:?}", request);
        Box::new(futures::future::ok(Response::new()))
    }
}