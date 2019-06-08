#[macro_use] 
extern crate log;
extern crate env_logger;
extern crate hyper;
extern crate futures;
mod service;

fn main() {
    env_logger::init();
    let address = "127.0.0.1:8080".parse().unwrap();
    let server = hyper::server::Http::new()
        .bind(&address, || Ok(service::Microservice {}))
        .unwrap();
    info!("Running microservice at {}", address);
    server.run().unwrap();
}