# Lab 01 Part 1: Docker

This lab is a short intro to the `docker` command line and its basic usage!

## Setup

Make sure you have Docker installed on your machine. You can download it from the [Docker website](https://www.docker.com/products/docker-desktop). You may also use [OrbStack](https://orbstack.dev/) as an alternative Docker runtime if you want.

## Running your first container

To run your first Docker container, you can use the following command:

```bash
docker run hello-world
```

This will download the `hello-world` image from Docker Hub and run it. You should see a message confirming that your installation is working correctly.

## Running your first (useful) container

Let's try to start a fresh, interactive container using the `ubuntu` image:

```bash
docker pull ubuntu:latest
```

The `:latest` indicates the tag of the image, which typically refers to the most recent version of the image. This could be updated as new versions of the image are released, and there are other tags available for specific versions of the image in case you want to pin to a particular version (e.g., `ubuntu:22.04`). It's usually a good practice to specify a particular version to ensure consistency in your environment!

Running the pull command will show you a progress of the image being downloaded from Docker Hub. Notice that the image is composed of multiple layers, and each layer is downloaded separately. This allows for efficient reuse of layers across different images.

Now, you can run a container using the downloaded `ubuntu` image:

```bash
docker run -it ubuntu:latest bash
```

The flag `-it` stands for interactive and tty, which allows you to interact with the container's terminal. The `-i` flag keeps STDIN open even if not attached, and the `-t` flag allocates a pseudo-TTY. This combination is commonly used when you want to have an interactive session with the container. Any subsequent commands you type will be executed within the container's environment (in this case, we're starting a `bash` shell inside the Ubuntu container). Go ahead, play around with some commands inside the container!

To exit the container, you can type `exit` or press `Ctrl+D`.

### Some things to notice

Notice that your changes in the container are not persisted. Once you exit the container, any changes you made will be lost. This is because the container is ephemeral by default. If you want to persist changes, you would need to commit the container to a new image or use volumes to mount persistent storage. We'll talk more about this later.

## Exercise: Capture the flag

Your job is to find the flag hidden within the Docker environment. Start by pulling the following image:

```bash
docker pull ghcr.io/cis1912/lab01-part-1
```

Your job is to find the (not so) hidden `/secret.txt` file and copy it to this directory (`part-1` in the lab). You can do this by running the container interactively, finding the file, and then copying it out of the container, or directly using the run command with the appropriate flags to extract the file.

## More useful docker containers!

But why would you want a completely isolated environment? We already discussed about how hard it is to ship a working version of your application. Docker containers provide a way to package your application and all its dependencies into a single, portable unit that can run consistently across different environments.

This means that running a web app becomes way easier, as you can ensure that it runs the same way in development, testing, and production environments.

An example of this is `alexta69/metube`, an application that allows you to download videos from YouTube. Try runnning it!

```bash
docker run alexta69/metube
```

You will notice that the server is now running at port `8081`.

```
INFO:main:Listening on 0.0.0.0:8081
```

...or is it?

Wait, actually we cannot see anything. Why is that? That's because by default, the container is running on a different network than your host machine. We need to expose the port on the container to the host machine.

Can you figure out how to expose the application on port 8081 on your machine? The [docker documentation](https://docs.docker.com/reference/cli/docker/) might help.

Once you have it working, try accessing the application in your browser at `http://localhost:8081` and start downloading videos!

### Persistence

Docker containers are ephemeral by default, meaning that any changes made to the container's filesystem are lost when the container is stopped or removed. To persist data, you can use volumes to mount a directory from the host machine into the container. This allows you to store data outside of the container, so it persists even if the container is removed.

Can you also figure out a way to persist the videos downloaded by the `alexta69/metube` application? (Hint: the videos are stored in `/downloads` in the container's filesystem)