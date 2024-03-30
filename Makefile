SRC = ngspicejs lint beautify
OBJ = ${SRC:.c=.o}
CC = g++
CFLAGS += -g3 -fno-omit-frame-pointer -lreadline -lv8 -lpthread -lglib-2.0 -lasound -lm -lssl -lcrypto -Wall -ggdb -I/usr/include/glib-2.0 -I/usr/lib/x86_64-linux-gnu/glib-2.0/include -I/usr/include/v8
#CFLAGS += -fsanitize=address,undefined -g3 -fno-omit-frame-pointer -lreadline -lv8 -lpthread -lglib-2.0 -lssl -lcrypto -Wall -ggdb -I/usr/include/glib-2.0 -I/usr/lib/x86_64-linux-gnu/glib-2.0/include -I/usr/include/v8
LIBS =

all: ngspicejs lint beautify

rebuild: clean all

ngspicejs:
	@rm -f ngspicejs
	g++ -o ngspicejs cpp/ngspicejs.cpp $(CFLAGS) -lngspice 

lint:
	@rm -f ngspicejs-lint
	g++ -o ngspicejs-lint cpp/ngspicejs-lint.cpp $(CFLAGS)

beautify:
	@rm -f ngspicejs-beautify
	g++ -o ngspicejs-beautify cpp/ngspicejs-beautify.cpp $(CFLAGS)

clean:
	@rm -f ngspicejs ngspicejs-lint ngspicejs-beautify

install:
	@if [ ! -d ~/bin ]; then echo "ERROR: You need to create ~/bin directory and add it to PATH variable!"; exit 1; fi
	ln -sf $$PWD/ngspicejs ~/bin/ngspicejs
	ln -sf $$PWD/ngspicejs-lint ~/bin/ngspicejs-lint
	ln -sf $$PWD/ngspicejs-beautify ~/bin/ngspicejs-beautify
	mkdir -p ~/.config/ngspicejs
